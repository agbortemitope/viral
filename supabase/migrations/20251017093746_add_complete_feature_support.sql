-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('interaction', 'message', 'review', 'payment', 'budget_depleted', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, reviewee_id, listing_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid());

CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);

-- Create favorites table for saved ads and creators
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorited_type text NOT NULL CHECK (favorited_type IN ('content', 'creator', 'listing')),
  favorited_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, favorited_type, favorited_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_favorited_id ON public.favorites(favorited_id);

-- Add analytics fields to content table if they don't exist
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS clicks_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ctr DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMPTZ;

-- Create analytics snapshots table
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  clicks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, date)
);

ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their content analytics"
  ON public.analytics_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content
      WHERE content.id = analytics_snapshots.content_id
      AND content.user_id = auth.uid()
    )
  );

CREATE INDEX idx_analytics_snapshots_content_id ON public.analytics_snapshots(content_id);
CREATE INDEX idx_analytics_snapshots_date ON public.analytics_snapshots(date DESC);

-- Add portfolio visibility field to marketplace_listings
ALTER TABLE public.marketplace_listings
ADD COLUMN IF NOT EXISTS show_portfolio BOOLEAN DEFAULT true;

-- Function to update content analytics
CREATE OR REPLACE FUNCTION public.update_content_analytics(
  p_content_id uuid,
  p_interaction_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE content
  SET
    clicks_count = CASE WHEN p_interaction_type = 'click' THEN clicks_count + 1 ELSE clicks_count END,
    views_count = CASE WHEN p_interaction_type = 'view' THEN views_count + 1 ELSE views_count END,
    conversions_count = CASE WHEN p_interaction_type = 'conversion' THEN conversions_count + 1 ELSE conversions_count END,
    last_interaction_at = now(),
    ctr = CASE
      WHEN views_count > 0 THEN (clicks_count::DECIMAL / NULLIF(views_count, 0)::DECIMAL) * 100
      ELSE 0
    END
  WHERE id = p_content_id;

  INSERT INTO analytics_snapshots (content_id, date, clicks, views, conversions)
  VALUES (
    p_content_id,
    CURRENT_DATE,
    CASE WHEN p_interaction_type = 'click' THEN 1 ELSE 0 END,
    CASE WHEN p_interaction_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN p_interaction_type = 'conversion' THEN 1 ELSE 0 END
  )
  ON CONFLICT (content_id, date)
  DO UPDATE SET
    clicks = analytics_snapshots.clicks + EXCLUDED.clicks,
    views = analytics_snapshots.views + EXCLUDED.views,
    conversions = analytics_snapshots.conversions + EXCLUDED.conversions;
END;
$$;

-- Function to check and deactivate ads with depleted budgets
CREATE OR REPLACE FUNCTION public.check_and_deactivate_depleted_ads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ad_record RECORD;
BEGIN
  FOR ad_record IN
    SELECT c.id, c.title, c.user_id, c.budget, c.total_spent
    FROM content c
    WHERE c.status = 'active'
    AND c.total_spent >= c.budget
  LOOP
    UPDATE content
    SET status = 'completed'
    WHERE id = ad_record.id;

    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      ad_record.user_id,
      'budget_depleted',
      'Ad Budget Depleted',
      'Your ad "' || ad_record.title || '" has been deactivated due to budget depletion. Total spent: ' || ad_record.total_spent || ' coins.',
      '/dashboard'
    );
  END LOOP;
END;
$$;

-- Function to calculate average rating for a user
CREATE OR REPLACE FUNCTION public.calculate_user_rating(p_user_id uuid)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews
  WHERE reviewee_id = p_user_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$;

-- Trigger to update marketplace listing rating when review is added
CREATE OR REPLACE FUNCTION public.update_listing_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.listing_id IS NOT NULL THEN
    UPDATE marketplace_listings
    SET 
      rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE listing_id = NEW.listing_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE listing_id = NEW.listing_id
      )
    WHERE id = NEW.listing_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_listing_rating
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_listing_rating();

-- Function to track content spend
CREATE OR REPLACE FUNCTION public.track_content_spend(
  p_content_id uuid,
  p_amount DECIMAL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE content
  SET total_spent = total_spent + p_amount
  WHERE id = p_content_id;
  
  IF (SELECT total_spent >= budget FROM content WHERE id = p_content_id) THEN
    PERFORM check_and_deactivate_depleted_ads();
  END IF;
END;
$$;

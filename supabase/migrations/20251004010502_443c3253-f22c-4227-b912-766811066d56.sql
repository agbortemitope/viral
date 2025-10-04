-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price_min NUMERIC NOT NULL DEFAULT 0,
  price_max NUMERIC NOT NULL DEFAULT 0,
  pricing_type TEXT NOT NULL DEFAULT 'fixed',
  availability TEXT NOT NULL DEFAULT 'available',
  location TEXT,
  remote_work BOOLEAN DEFAULT false,
  experience_level TEXT NOT NULL DEFAULT 'intermediate',
  delivery_time TEXT,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on marketplace_listings
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
CREATE POLICY "Marketplace listings are viewable by everyone" 
  ON public.marketplace_listings FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can create their own marketplace listings" 
  ON public.marketplace_listings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace listings" 
  ON public.marketplace_listings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace listings" 
  ON public.marketplace_listings FOR DELETE 
  USING (auth.uid() = user_id);

-- Create advertiser_analytics table
CREATE TABLE IF NOT EXISTS public.advertiser_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  total_spend NUMERIC DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  avg_cpc NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on advertiser_analytics
ALTER TABLE public.advertiser_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advertiser_analytics
CREATE POLICY "Users can view their own analytics" 
  ON public.advertiser_analytics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
  ON public.advertiser_analytics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" 
  ON public.advertiser_analytics FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create ad_demographics table
CREATE TABLE IF NOT EXISTS public.ad_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  age_group TEXT,
  gender TEXT,
  device_type TEXT,
  location_country TEXT,
  location_city TEXT,
  interaction_type TEXT NOT NULL,
  interaction_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ad_demographics
ALTER TABLE public.ad_demographics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ad_demographics
CREATE POLICY "Users can view their own ad demographics" 
  ON public.ad_demographics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ad demographics" 
  ON public.ad_demographics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ad demographics" 
  ON public.ad_demographics FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to increment listing views
CREATE OR REPLACE FUNCTION public.increment_listing_views(listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE marketplace_listings
  SET views_count = views_count + 1
  WHERE id = listing_id;
END;
$$;

-- Create function to track ad demographics
CREATE OR REPLACE FUNCTION public.track_ad_demographics(
  p_content_id UUID,
  p_user_id UUID,
  p_interaction_type TEXT,
  p_age_group TEXT DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_device_type TEXT DEFAULT NULL,
  p_location_country TEXT DEFAULT NULL,
  p_location_city TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ad_demographics (
    content_id,
    user_id,
    interaction_type,
    age_group,
    gender,
    device_type,
    location_country,
    location_city
  ) VALUES (
    p_content_id,
    p_user_id,
    p_interaction_type,
    p_age_group,
    p_gender,
    p_device_type,
    p_location_country,
    p_location_city
  );
END;
$$;

-- Create trigger for marketplace_listings updated_at
CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for advertiser_analytics updated_at
CREATE TRIGGER update_advertiser_analytics_updated_at
  BEFORE UPDATE ON public.advertiser_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for ad_demographics updated_at
CREATE TRIGGER update_ad_demographics_updated_at
  BEFORE UPDATE ON public.ad_demographics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
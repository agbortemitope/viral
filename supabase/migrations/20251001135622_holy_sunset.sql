/*
  # Advanced Dashboard Features

  1. New Tables
    - `user_documents` - Store CV/resume uploads
    - `marketplace_listings` - User marketplace profiles
    - `advertiser_analytics` - Track ad performance and demographics
    - `ad_demographics` - Store demographic data for ads

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own data
    - Add policies for viewing marketplace listings

  3. Features
    - CV/Resume upload functionality
    - Marketplace profile creation
    - Advanced advertiser analytics
    - Demographic tracking
*/

-- Create user_documents table for CV/resume uploads
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('cv', 'resume', 'portfolio', 'certificate')),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  subcategory text,
  price_min numeric DEFAULT 0,
  price_max numeric DEFAULT 0,
  pricing_type text DEFAULT 'hourly' CHECK (pricing_type IN ('hourly', 'fixed', 'negotiable')),
  availability text DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  location text,
  remote_work boolean DEFAULT true,
  experience_level text DEFAULT 'intermediate' CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  delivery_time text,
  featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  contact_count integer DEFAULT 0,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create advertiser_analytics table
CREATE TABLE IF NOT EXISTS advertiser_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  total_spend numeric DEFAULT 0,
  total_views integer DEFAULT 0,
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  ctr numeric DEFAULT 0, -- Click-through rate
  cpc numeric DEFAULT 0, -- Cost per click
  cpm numeric DEFAULT 0, -- Cost per mille (thousand impressions)
  date_tracked date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id, date_tracked)
);

-- Create ad_demographics table
CREATE TABLE IF NOT EXISTS ad_demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  age_group text NOT NULL CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  location_country text,
  location_city text,
  device_type text CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  interaction_type text NOT NULL CHECK (interaction_type IN ('view', 'click', 'conversion')),
  interaction_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertiser_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_demographics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_documents
CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON user_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON user_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON user_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view active marketplace listings"
  ON marketplace_listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own listings"
  ON marketplace_listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
  ON marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for advertiser_analytics
CREATE POLICY "Users can view their own analytics"
  ON advertiser_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
  ON advertiser_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
  ON advertiser_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for ad_demographics (read-only for content owners)
CREATE POLICY "Content owners can view demographics"
  ON ad_demographics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content 
      WHERE content.id = ad_demographics.content_id 
      AND content.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_documents_updated_at
  BEFORE UPDATE ON user_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertiser_analytics_updated_at
  BEFORE UPDATE ON advertiser_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update marketplace listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id uuid)
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
CREATE OR REPLACE FUNCTION track_ad_demographics(
  p_content_id uuid,
  p_age_group text,
  p_gender text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_device text DEFAULT 'desktop',
  p_interaction_type text DEFAULT 'view'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ad_demographics (
    content_id,
    age_group,
    gender,
    location_country,
    location_city,
    device_type,
    interaction_type,
    interaction_count
  )
  VALUES (
    p_content_id,
    p_age_group,
    p_gender,
    p_country,
    p_city,
    p_device,
    p_interaction_type,
    1
  )
  ON CONFLICT (content_id, age_group, gender, location_country, device_type, interaction_type)
  DO UPDATE SET
    interaction_count = ad_demographics.interaction_count + 1;
END;
$$;
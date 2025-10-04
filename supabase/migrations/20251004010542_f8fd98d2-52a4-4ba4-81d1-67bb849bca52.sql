-- Create function to increment listing contacts
CREATE OR REPLACE FUNCTION public.increment_listing_contacts(listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE marketplace_listings
  SET contact_count = contact_count + 1
  WHERE id = listing_id;
END;
$$;
-- Add application_instructions field to marketplace_listings table
ALTER TABLE marketplace_listings 
ADD COLUMN application_instructions TEXT;

COMMENT ON COLUMN marketplace_listings.application_instructions IS 'Instructions on how to apply for the job/service';
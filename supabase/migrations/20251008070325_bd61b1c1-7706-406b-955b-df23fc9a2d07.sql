-- Drop old check constraint and add new one with all content types
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_content_type_check;

ALTER TABLE content ADD CONSTRAINT content_content_type_check 
CHECK (content_type IN ('job', 'event', 'ad', 'property', 'product', 'paid_task'));

-- Ensure contact_link column exists (should already exist from previous migration)
-- Add comment for clarity
COMMENT ON COLUMN content.contact_link IS 'Contact link for ad interactions (WhatsApp, email, etc.)';
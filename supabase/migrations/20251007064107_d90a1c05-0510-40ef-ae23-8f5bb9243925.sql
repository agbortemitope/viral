-- Add contact_link field to content table
ALTER TABLE content ADD COLUMN contact_link text;

-- Add bank account fields to profiles table
ALTER TABLE profiles ADD COLUMN bank_name text;
ALTER TABLE profiles ADD COLUMN account_number text;
ALTER TABLE profiles ADD COLUMN account_name text;
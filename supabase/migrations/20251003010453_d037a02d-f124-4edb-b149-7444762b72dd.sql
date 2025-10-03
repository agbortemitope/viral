-- Add marketplace and portfolio link fields to profiles (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketplace_enabled') THEN
    ALTER TABLE public.profiles ADD COLUMN marketplace_enabled BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'portfolio_link') THEN
    ALTER TABLE public.profiles ADD COLUMN portfolio_link TEXT;
  END IF;
END $$;
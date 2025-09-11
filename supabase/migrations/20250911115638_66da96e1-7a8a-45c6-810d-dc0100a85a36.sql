-- Fix security vulnerability: Restrict profile visibility to own profiles only
-- Remove the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Optional: Allow viewing basic public profile info for specific use cases
-- This policy allows viewing only username and avatar for other users (for social features)
-- You can uncomment this if you need users to see basic info of others
-- CREATE POLICY "Users can view basic public info of other profiles" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (true)
-- WITH CHECK (false); -- This would need to be implemented with column-level security
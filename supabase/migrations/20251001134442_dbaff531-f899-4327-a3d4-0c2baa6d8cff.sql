-- Add view tracking to user_interactions if not already tracked
-- Ensure interaction_type supports: 'view', 'click', 'conversation'

-- Create a function to calculate and distribute rewards based on interaction counts
CREATE OR REPLACE FUNCTION public.calculate_and_distribute_rewards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  views_count INTEGER;
  interactions_count INTEGER;
  conversations_count INTEGER;
  coins_to_award INTEGER;
BEGIN
  -- Loop through each user and calculate their pending rewards
  FOR user_record IN 
    SELECT DISTINCT user_id FROM user_interactions WHERE rewarded = false
  LOOP
    -- Count unrewarded views (10 views = 1 coin)
    SELECT COUNT(*) INTO views_count
    FROM user_interactions
    WHERE user_id = user_record.user_id 
      AND interaction_type = 'view' 
      AND rewarded = false;
    
    -- Count unrewarded interactions (10 interactions = 2 coins)
    SELECT COUNT(*) INTO interactions_count
    FROM user_interactions
    WHERE user_id = user_record.user_id 
      AND interaction_type = 'click' 
      AND rewarded = false;
    
    -- Count unrewarded conversations (10 conversations = 10 coins)
    SELECT COUNT(*) INTO conversations_count
    FROM user_interactions
    WHERE user_id = user_record.user_id 
      AND interaction_type = 'conversation' 
      AND rewarded = false;
    
    -- Calculate coins to award
    coins_to_award := 
      (views_count / 10) * 1 + 
      (interactions_count / 10) * 2 + 
      (conversations_count / 10) * 10;
    
    -- If there are coins to award, update profile and mark interactions as rewarded
    IF coins_to_award > 0 THEN
      -- Update user's coin balance
      UPDATE profiles
      SET coins = coins + coins_to_award,
          total_earnings = total_earnings + coins_to_award
      WHERE user_id = user_record.user_id;
      
      -- Mark the exact number of interactions as rewarded
      WITH rewarded_views AS (
        SELECT id FROM user_interactions
        WHERE user_id = user_record.user_id 
          AND interaction_type = 'view' 
          AND rewarded = false
        LIMIT (views_count / 10) * 10
      ),
      rewarded_interactions AS (
        SELECT id FROM user_interactions
        WHERE user_id = user_record.user_id 
          AND interaction_type = 'click' 
          AND rewarded = false
        LIMIT (interactions_count / 10) * 10
      ),
      rewarded_conversations AS (
        SELECT id FROM user_interactions
        WHERE user_id = user_record.user_id 
          AND interaction_type = 'conversation' 
          AND rewarded = false
        LIMIT (conversations_count / 10) * 10
      )
      UPDATE user_interactions
      SET rewarded = true
      WHERE id IN (
        SELECT id FROM rewarded_views
        UNION ALL
        SELECT id FROM rewarded_interactions
        UNION ALL
        SELECT id FROM rewarded_conversations
      );
      
      -- Create transaction record
      INSERT INTO transactions (user_id, amount, transaction_type, description)
      VALUES (
        user_record.user_id,
        coins_to_award,
        'reward',
        'Earned from interactions: ' || (views_count / 10) || ' view sets, ' || 
        (interactions_count / 10) || ' interaction sets, ' || 
        (conversations_count / 10) || ' conversation sets'
      );
    END IF;
  END LOOP;
END;
$$;

-- Add coin purchase transactions support
-- Create exchange_rate column in transactions to track conversion rates
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS exchange_rate TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS fiat_amount NUMERIC;

-- Add payment-related fields
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT;
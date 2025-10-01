import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const trackInteraction = async (
    contentId: string,
    interactionType: 'view' | 'click' | 'conversation'
  ) => {
    if (!user) return { success: false };

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          content_id: contentId,
          interaction_type: interactionType,
          rewarded: false,
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error tracking interaction:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const calculatePendingRewards = async () => {
    if (!user) return { success: false };

    try {
      // Call the database function to calculate and distribute rewards
      const { error } = await supabase.rpc('calculate_and_distribute_rewards');

      if (error) throw error;

      toast({
        title: "Rewards calculated",
        description: "Your pending rewards have been processed",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error calculating rewards:', error);
      toast({
        title: "Error calculating rewards",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getPendingInteractions = async () => {
    if (!user) return { views: 0, interactions: 0, conversations: 0 };

    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('interaction_type')
        .eq('user_id', user.id)
        .eq('rewarded', false);

      if (error) throw error;

      const views = data?.filter(i => i.interaction_type === 'view').length || 0;
      const interactions = data?.filter(i => i.interaction_type === 'click').length || 0;
      const conversations = data?.filter(i => i.interaction_type === 'conversation').length || 0;

      return { views, interactions, conversations };
    } catch (error) {
      console.error('Error fetching pending interactions:', error);
      return { views: 0, interactions: 0, conversations: 0 };
    }
  };

  return {
    trackInteraction,
    calculatePendingRewards,
    getPendingInteractions,
    loading,
  };
};

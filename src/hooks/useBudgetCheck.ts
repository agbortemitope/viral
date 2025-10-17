import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useBudgetCheck = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkBudgets();

      const channel = supabase
        .channel('budget-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'content',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const content = payload.new as any;
            if (content.total_spent >= content.budget && content.status === 'active') {
              toast({
                title: 'Budget Depleted',
                description: `Your ad "${content.title}" has been deactivated.`,
                variant: 'destructive',
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const checkBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('id, title, budget, total_spent, status')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;

      data?.forEach(async (ad) => {
        if (ad.total_spent >= ad.budget) {
          await supabase
            .from('content')
            .update({ status: 'completed' })
            .eq('id', ad.id);

          toast({
            title: 'Ad Deactivated',
            description: `"${ad.title}" has been deactivated due to budget depletion.`,
            variant: 'destructive',
          });
        }
      });
    } catch (error) {
      console.error('Error checking budgets:', error);
    }
  };

  return { checkBudgets };
};

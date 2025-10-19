import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ContentAnalytics {
  id: string;
  title: string;
  content_type: string;
  clicks_count: number;
  views_count: number;
  conversions_count: number;
  total_spent: number;
  budget: number;
  reward_coins: number;
  ctr: number;
  status: string;
  created_at: string;
  last_interaction_at: string;
}

interface DailySnapshot {
  date: string;
  clicks: number;
  views: number;
  conversions: number;
}

export const useAnalytics = (contentId?: string) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ContentAnalytics[]>([]);
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (contentId) {
        fetchContentAnalytics(contentId);
        fetchSnapshots(contentId);
      } else {
        fetchAllAnalytics();
      }
    }
  }, [user, contentId]);

  const fetchAllAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('id, title, content_type, clicks_count, views_count, conversions_count, total_spent, budget, reward_coins, ctr, status, created_at, last_interaction_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentAnalytics = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAnalytics([data]);
    } catch (error) {
      console.error('Error fetching content analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSnapshots = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('analytics_snapshots')
        .select('date, clicks, views, conversions')
        .eq('content_id', id)
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;
      setSnapshots(data || []);
    } catch (error) {
      console.error('Error fetching snapshots:', error);
    }
  };

  const trackInteraction = async (contentId: string, type: 'view' | 'click' | 'conversion') => {
    try {
      await supabase.rpc('update_content_analytics', {
        p_content_id: contentId,
        p_interaction_type: type,
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  return {
    analytics,
    snapshots,
    loading,
    trackInteraction,
    refetch: contentId ? () => fetchContentAnalytics(contentId) : fetchAllAnalytics,
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdvertiserAnalytics {
  total_spend: number;
  total_views: number;
  total_clicks: number;
  total_conversions: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille
  date_tracked: string;
}

interface DemographicData {
  age_group: string;
  gender?: string;
  location_country?: string;
  location_city?: string;
  device_type?: string;
  interaction_type: string;
  interaction_count: number;
}

interface GeographyData {
  country: string;
  city?: string;
  views: number;
  clicks: number;
  conversions: number;
}

export const useAdvertiserAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdvertiserAnalytics[]>([]);
  const [demographics, setDemographics] = useState<DemographicData[]>([]);
  const [geography, setGeography] = useState<GeographyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchDemographics();
      fetchGeography();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('advertiser_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .order('date_tracked', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching advertiser analytics:', error);
    }
  };

  const fetchDemographics = async () => {
    try {
      // Get demographics for user's content
      const { data: userContent } = await supabase
        .from('content')
        .select('id')
        .eq('user_id', user?.id);

      if (!userContent || userContent.length === 0) {
        setDemographics([]);
        return;
      }

      const contentIds = userContent.map(c => c.id);

      const { data, error } = await supabase
        .from('ad_demographics')
        .select('*')
        .in('content_id', contentIds);

      if (error) throw error;
      setDemographics(data || []);
    } catch (error) {
      console.error('Error fetching demographics:', error);
    }
  };

  const fetchGeography = async () => {
    try {
      // Get geography data for user's content
      const { data: userContent } = await supabase
        .from('content')
        .select('id')
        .eq('user_id', user?.id);

      if (!userContent || userContent.length === 0) {
        setGeography([]);
        return;
      }

      const contentIds = userContent.map(c => c.id);

      const { data, error } = await supabase
        .from('ad_demographics')
        .select('location_country, location_city, interaction_type, interaction_count')
        .in('content_id', contentIds)
        .not('location_country', 'is', null);

      if (error) throw error;

      // Aggregate geography data
      const geoMap = new Map<string, GeographyData>();
      
      data?.forEach(item => {
        const key = `${item.location_country}-${item.location_city || 'Unknown'}`;
        const existing = geoMap.get(key) || {
          country: item.location_country || 'Unknown',
          city: item.location_city || undefined,
          views: 0,
          clicks: 0,
          conversions: 0,
        };

        switch (item.interaction_type) {
          case 'view':
            existing.views += item.interaction_count;
            break;
          case 'click':
            existing.clicks += item.interaction_count;
            break;
          case 'conversion':
            existing.conversions += item.interaction_count;
            break;
        }

        geoMap.set(key, existing);
      });

      setGeography(Array.from(geoMap.values()));
    } catch (error) {
      console.error('Error fetching geography data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackAdInteraction = async (
    contentId: string,
    ageGroup: string,
    gender?: string,
    country?: string,
    city?: string,
    deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop',
    interactionType: 'view' | 'click' | 'conversion' = 'view'
  ) => {
    try {
      await supabase.rpc('track_ad_demographics', {
        p_content_id: contentId,
        p_age_group: ageGroup,
        p_gender: gender,
        p_country: country,
        p_city: city,
        p_device: deviceType,
        p_interaction_type: interactionType,
      });

      // Refresh data after tracking
      await fetchDemographics();
      await fetchGeography();
    } catch (error) {
      console.error('Error tracking ad interaction:', error);
    }
  };

  const getAgeGroupData = () => {
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
    return ageGroups.map(group => {
      const groupData = demographics.filter(d => d.age_group === group);
      const totalInteractions = groupData.reduce((sum, d) => sum + d.interaction_count, 0);
      return {
        age_group: group,
        interactions: totalInteractions,
        percentage: demographics.length > 0 ? (totalInteractions / demographics.reduce((sum, d) => sum + d.interaction_count, 0)) * 100 : 0
      };
    });
  };

  const getGenderData = () => {
    const genders = ['male', 'female', 'other', 'prefer_not_to_say'];
    return genders.map(gender => {
      const genderData = demographics.filter(d => d.gender === gender);
      const totalInteractions = genderData.reduce((sum, d) => sum + d.interaction_count, 0);
      return {
        gender,
        interactions: totalInteractions,
        percentage: demographics.length > 0 ? (totalInteractions / demographics.reduce((sum, d) => sum + d.interaction_count, 0)) * 100 : 0
      };
    });
  };

  const getTotalSpend = () => {
    return analytics.reduce((sum, a) => sum + a.total_spend, 0);
  };

  const getAverageCTR = () => {
    if (analytics.length === 0) return 0;
    return analytics.reduce((sum, a) => sum + a.ctr, 0) / analytics.length;
  };

  return {
    analytics,
    demographics,
    geography,
    loading,
    trackAdInteraction,
    getAgeGroupData,
    getGenderData,
    getTotalSpend,
    getAverageCTR,
    refetch: () => {
      fetchAnalytics();
      fetchDemographics();
      fetchGeography();
    },
  };
};
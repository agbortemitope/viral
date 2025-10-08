import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface MarketplaceListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price_min: number;
  price_max: number;
  pricing_type: string;
  availability: string;
  location?: string;
  remote_work: boolean;
  experience_level: string;
  delivery_time?: string;
  application_instructions?: string;
  featured: boolean;
  views_count: number;
  contact_count: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
    username: string;
  };
}

export const useMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [userListing, setUserListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
    if (user) {
      fetchUserListing();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles!marketplace_listings_user_id_fkey (
            full_name,
            avatar_url,
            username
          )
        `)
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data as any) || []);
    } catch (error: any) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListing = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserListing(data || null);
    } catch (error: any) {
      console.error('Error fetching user listing:', error);
    }
  };

  const createListing = async (listingData: Partial<MarketplaceListing> & { title: string; description: string; category: string }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert([{
          ...listingData,
          user_id: user.id,
        } as any])
        .select()
        .single();

      if (error) throw error;

      await fetchUserListing();
      await fetchListings();

      toast({
        title: "Listing created",
        description: "Your marketplace listing has been created successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateListing = async (listingId: string, updates: Partial<MarketplaceListing>) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .update(updates)
        .eq('id', listingId)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      await fetchUserListing();
      await fetchListings();

      toast({
        title: "Listing updated",
        description: "Your marketplace listing has been updated successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating listing",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const incrementViews = async (listingId: string) => {
    try {
      await supabase.rpc('increment_listing_views', { listing_id: listingId });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const incrementContacts = async (listingId: string) => {
    try {
      await supabase.rpc('increment_listing_contacts', { listing_id: listingId });
    } catch (error) {
      console.error('Error incrementing contacts:', error);
    }
  };

  return {
    listings,
    userListing,
    loading,
    createListing,
    updateListing,
    incrementViews,
    incrementContacts,
    refetch: fetchListings,
  };
};
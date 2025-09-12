import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_communications: boolean;
}

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    marketing_communications: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications, push_notifications, marketing_communications')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? false,
          marketing_communications: data.marketing_communications ?? false,
        });
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(newSettings)
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
};
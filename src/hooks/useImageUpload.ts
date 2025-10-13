import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadImage = async (file: File, bucket: 'ad-images' | 'task-screenshots'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return null;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return null;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: 'ad-images' | 'task-screenshots'): Promise<boolean> => {
    try {
      const path = url.split(`/${bucket}/`)[1];
      if (!path) return false;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Image has been deleted",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { uploadImage, deleteImage, uploading };
};

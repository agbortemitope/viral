import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UserDocument {
  id: string;
  document_type: 'cv' | 'resume' | 'portfolio' | 'certificate';
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_primary: boolean;
  created_at: string;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File, 
    documentType: 'cv' | 'resume' | 'portfolio' | 'certificate'
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      setUploading(true);

      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File must be PDF, DOC, DOCX, JPG, or PNG');
      }

      // Create file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // For now, we'll simulate file upload since we can't use Supabase storage
      // In production, this would upload to Supabase storage
      const mockUrl = `https://example.com/documents/${fileName}`;

      // Save document record to database
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_name: file.name,
          file_url: mockUrl,
          file_size: file.size,
          mime_type: file.type,
          is_primary: documents.filter(d => d.document_type === documentType).length === 0
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Document uploaded",
        description: `Your ${documentType} has been successfully uploaded.`,
      });

      return mockUrl;
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

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setPrimaryDocument = async (documentId: string, documentType: string) => {
    try {
      // First, unset all primary documents of this type
      await supabase
        .from('user_documents')
        .update({ is_primary: false })
        .eq('user_id', user?.id)
        .eq('document_type', documentType);

      // Then set the selected document as primary
      const { error } = await supabase
        .from('user_documents')
        .update({ is_primary: true })
        .eq('id', documentId);

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Primary document updated",
        description: "Document has been set as primary.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    setPrimaryDocument,
    refetch: fetchDocuments,
  };
};
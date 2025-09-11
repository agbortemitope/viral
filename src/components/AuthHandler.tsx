import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (type === 'signup' && accessToken && refreshToken) {
        try {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          if (data.session) {
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified successfully.",
            });
            
            // Clean up URL and navigate to feed
            window.history.replaceState({}, document.title, '/feed');
            navigate('/feed', { replace: true });
          }
        } catch (error: any) {
          console.error('Error handling auth callback:', error);
          toast({
            title: "Confirmation error",
            description: "There was an issue confirming your email. Please try again.",
            variant: "destructive",
          });
          navigate('/signup', { replace: true });
        }
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, toast]);

  return null;
};

export default AuthHandler;
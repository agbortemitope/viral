import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Wallet from "./pages/Wallet";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const AuthHandler = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Handle auth state changes and email confirmations
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if this is from email confirmation
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('type') === 'signup') {
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified successfully.",
            });
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  return null;
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/signup" element={<SignUp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

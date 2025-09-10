import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Wallet from "./pages/Wallet";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import HelpCenter from "./pages/support/HelpCenter";
import CreatorGuide from "./pages/support/CreatorGuide";
import Community from "./pages/support/Community";
import ContactUs from "./pages/support/ContactUs";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CreatorAgreement from "./pages/legal/CreatorAgreement";
import CookiePolicy from "./pages/legal/CookiePolicy";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="viral-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Support Pages */}
            <Route path="/support/help-center" element={<HelpCenter />} />
            <Route path="/support/creator-guide" element={<CreatorGuide />} />
            <Route path="/support/community" element={<Community />} />
            <Route path="/support/contact-us" element={<ContactUs />} />
            
            {/* Legal Pages */}
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal/creator-agreement" element={<CreatorAgreement />} />
            <Route path="/legal/cookie-policy" element={<CookiePolicy />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

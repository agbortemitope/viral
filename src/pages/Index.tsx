import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <HeroSection />
      <Dashboard />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;

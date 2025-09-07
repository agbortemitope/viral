import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CreatorCash
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </a>
          <a href="#earnings" className="text-muted-foreground hover:text-foreground transition-colors">
            Earnings
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="text-muted-foreground">
            Sign In
          </Button>
          <Button variant="hero" size="lg">
            Start Earning
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
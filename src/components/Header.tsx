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
            OpportunityHub
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
            Feed
          </a>
          <a href="/wallet" className="text-muted-foreground hover:text-foreground transition-colors">
            Wallet
          </a>
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
            Marketplace
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="text-muted-foreground">
            Sign In
          </Button>
          <Button variant="hero" size="lg">
            Join Platform
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
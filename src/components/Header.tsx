import { Button } from "@/components/ui/button";
import { Coins, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">OpportunityHub</h1>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
                Feed
              </Link>
              <Link to="/wallet" className="text-muted-foreground hover:text-foreground transition-colors">
                Wallet
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                Marketplace
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {profile && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{profile.coins}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
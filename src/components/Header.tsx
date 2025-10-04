import { Button } from "@/components/ui/button";
import { Coins, LogOut, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link to="/feed" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>
        Feed
      </Link>
      <Link to="/wallet" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>
        Wallet
      </Link>
      <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>
        Dashboard
      </Link>
      <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>
        Marketplace
      </Link>
    </>
  );

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Viral</h1>
          </Link>
          
          {user && (
            <>
              <nav className="hidden md:flex items-center space-x-6">
                <NavLinks />
              </nav>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <NavLinks />
                  </nav>
                </SheetContent>
              </Sheet>
            </>
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
                <ModeToggle />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <ModeToggle />
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
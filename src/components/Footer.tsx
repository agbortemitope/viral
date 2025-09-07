import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                OpportunityHub
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting users with opportunities through jobs, events, ads, and rewards.
            </p>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/feed" className="hover:text-foreground transition-colors">Feed</a></li>
              <li><a href="/wallet" className="hover:text-foreground transition-colors">Wallet</a></li>
              <li><a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
              <li><a href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Creator Guide</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Creator Agreement</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 OpportunityHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.66 13.728 3.66 12.417s.538-2.478 1.466-3.274c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.466 1.963 1.466 3.274s-.538 2.478-1.466 3.274c-.875.807-2.026 1.297-3.323 1.297z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, TrendingUp, Users, Star } from "lucide-react";
import heroImage from "@/assets/hero-creators.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="absolute inset-0 bg-background/50" />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  New Platform for Creators
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Turn Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Creativity
                </span>{" "}
                Into Cash
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of creators earning real money from engaging ads. 
                Get paid for every interaction, view, and engagement your content generates.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Play className="h-5 w-5 mr-2" />
                Start Earning Today
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                See How It Works
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2.4M+</div>
                <div className="text-sm text-muted-foreground">Paid to Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">45K+</div>
                <div className="text-sm text-muted-foreground">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={heroImage} 
                alt="Creators earning money from engaging ads"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating cards */}
            <Card className="absolute -bottom-6 -left-6 p-4 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-success/20 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <div className="text-sm font-medium">Monthly Earnings</div>
                  <div className="text-lg font-bold text-success">+$3,247</div>
                </div>
              </div>
            </Card>
            
            <Card className="absolute -top-6 -right-6 p-4 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">Engagement Rate</div>
                  <div className="text-lg font-bold text-accent">94.2%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
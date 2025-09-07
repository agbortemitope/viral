import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Users, 
  DollarSign 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Get paid immediately when users engage with your content. No waiting periods.",
      iconColor: "bg-accent/20 text-accent",
    },
    {
      icon: Shield,
      title: "Brand Safe Ads",
      description: "All ads are pre-screened to ensure they align with your content and values.",
      iconColor: "bg-success/20 text-success",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Your earnings dashboard works perfectly on any device, anywhere.",
      iconColor: "bg-primary/20 text-primary",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your performance with detailed metrics and trends.",
      iconColor: "bg-secondary/20 text-secondary",
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Connect with other creators and share strategies for maximizing earnings.",
      iconColor: "bg-primary/20 text-primary",
    },
    {
      icon: DollarSign,
      title: "Multiple Revenue Streams",
      description: "Earn from views, clicks, shares, and engagement bonuses.",
      iconColor: "bg-success/20 text-success",
    },
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Monetize
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to turn your creativity into a sustainable income.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20 group"
              >
                <div className={`p-3 rounded-lg ${feature.iconColor} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
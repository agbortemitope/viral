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
      title: "Instant Coin Rewards",
      description: "Earn coins immediately when you engage with opportunities. No waiting periods.",
      iconColor: "bg-accent/20 text-accent",
    },
    {
      icon: Shield,
      title: "Verified Opportunities",
      description: "All opportunities are pre-screened to ensure they are legitimate and valuable.",
      iconColor: "bg-success/20 text-success",
    },
    {
      icon: Smartphone,
      title: "Mobile First Design",
      description: "Access opportunities and manage your coins on any device, anywhere.",
      iconColor: "bg-primary/20 text-primary",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your earnings, engagement, and performance with detailed insights.",
      iconColor: "bg-secondary/20 text-secondary",
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with brands, employers, and other professionals in our marketplace.",
      iconColor: "bg-primary/20 text-primary",
    },
    {
      icon: DollarSign,
      title: "Multiple Income Streams",
      description: "Earn from job applications, event attendance, ad engagement, and referrals.",
      iconColor: "bg-success/20 text-success",
    },
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to discover opportunities and earn rewards.
          </p>
        </div>
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
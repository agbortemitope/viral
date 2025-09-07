import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetricsCard from "@/components/MetricsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  BarChart3, 
  Briefcase, 
  Coins, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Calendar,
  Settings,
  Edit3,
  Star,
  Award
} from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Coins Earned",
      value: "2,847",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Coins,
      iconColor: "success" as const,
    },
    {
      title: "Ads Engaged",
      value: "143",
      change: "+18.2% from last week",
      changeType: "positive" as const,
      icon: Eye,
      iconColor: "primary" as const,
    },
    {
      title: "Jobs Applied",
      value: "12",
      change: "+3 this week",
      changeType: "positive" as const,
      icon: Briefcase,
      iconColor: "accent" as const,
    },
    {
      title: "Engagement Score",
      value: "94.2",
      change: "Excellent performance",
      changeType: "neutral" as const,
      icon: TrendingUp,
      iconColor: "secondary" as const,
    },
  ];

  const portfolioItems = [
    { 
      title: "Web Development", 
      description: "Full-stack web development with React and Node.js",
      skills: ["React", "TypeScript", "Node.js"],
      rating: 4.8
    },
    { 
      title: "Digital Marketing", 
      description: "Social media marketing and content creation",
      skills: ["Social Media", "Content", "Analytics"],
      rating: 4.9
    },
    { 
      title: "Graphic Design", 
      description: "Brand identity and visual design solutions",
      skills: ["Photoshop", "Illustrator", "Branding"],
      rating: 4.7
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Section */}
          <Card className="lg:col-span-1 p-6 bg-gradient-card border-border/50">
            <div className="text-center mb-6">
              <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-muted-foreground text-sm">@johndoe</p>
              <Badge className="mt-2 bg-success/20 text-success border-success/30">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">2,847</p>
                <p className="text-xs text-muted-foreground">Total Coins</p>
              </div>
              
              <Button variant="outline" className="w-full">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button variant="ghost" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Metrics */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Track your activity and earnings</p>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 30 days
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                  <MetricsCard key={index} {...metric} />
                ))}
              </div>
            </div>

            {/* Analytics Chart */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Activity Overview
                </h3>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive activity chart will appear here
                  </p>
                </div>
              </div>
            </Card>

            {/* Portfolio Section */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  My Portfolio
                </h3>
                <Button variant="hero" size="sm">
                  Add Skill
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item, index) => (
                  <Card key={index} className="p-4 bg-background/50 border-border/30">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-accent fill-current" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
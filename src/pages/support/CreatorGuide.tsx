import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";

const CreatorGuide = () => {
  const steps = [
    {
      title: "Set Up Your Profile",
      description: "Complete your profile with a professional photo and compelling bio",
      icon: Users,
      status: "completed"
    },
    {
      title: "Create Your First Ad",
      description: "Learn how to create engaging content that converts",
      icon: Lightbulb,
      status: "current"
    },
    {
      title: "Target Your Audience",
      description: "Define and reach your ideal audience effectively",
      icon: Target,
      status: "upcoming"
    },
    {
      title: "Optimize Performance",
      description: "Use analytics to improve your ad performance",
      icon: TrendingUp,
      status: "upcoming"
    },
    {
      title: "Maximize Earnings",
      description: "Advanced strategies to increase your coin earnings",
      icon: DollarSign,
      status: "upcoming"
    }
  ];

  const tips = [
    {
      title: "Write Compelling Headlines",
      description: "Your headline is the first thing users see. Make it count with clear, benefit-driven language.",
      category: "Content"
    },
    {
      title: "Use High-Quality Images",
      description: "Visual content performs better. Use clear, professional images that relate to your message.",
      category: "Design"
    },
    {
      title: "Know Your Audience",
      description: "Understanding your target audience helps create more relevant and engaging content.",
      category: "Strategy"
    },
    {
      title: "Test and Iterate",
      description: "Try different approaches and use data to improve your content performance.",
      category: "Optimization"
    },
    {
      title: "Engage Authentically",
      description: "Build genuine connections with your audience through authentic communication.",
      category: "Engagement"
    },
    {
      title: "Monitor Performance",
      description: "Regularly check your analytics to understand what works and what doesn't.",
      category: "Analytics"
    }
  ];

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500/20 text-green-700', icon: CheckCircle };
      case 'current':
        return { color: 'bg-blue-500/20 text-blue-700', icon: Play };
      default:
        return { color: 'bg-gray-500/20 text-gray-700', icon: ArrowRight };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Creator Guide</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know to succeed as a creator on Viral
            </p>
          </div>

          {/* Getting Started Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Follow these steps to become a successful creator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const statusInfo = getStepStatus(step.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                          {step.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tips and Best Practices</CardTitle>
              <CardDescription>
                Proven strategies to improve your content performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{tip.title}</h3>
                      <Badge variant="outline">{tip.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Creating Your First Ad
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Audience Targeting Basics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Optimizing for Performance
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Connect with other creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Join Creator Discord
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Creator Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Monthly Creator Meetup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatorGuide;
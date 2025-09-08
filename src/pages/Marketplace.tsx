import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Star, 
  MapPin, 
  Coins,
  Search,
  Filter,
  TrendingUp,
  Eye,
  MessageCircle,
  Award
} from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  reviews: number;
  followers: number;
  category: string;
  location: string;
  coinRate: number;
  description: string;
  skills: string[];
  verified: boolean;
}

const Marketplace = () => {
  const influencers: Influencer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "@sarahjohnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviews: 127,
      followers: 45000,
      category: "Fashion & Lifestyle",
      location: "Lagos, Nigeria",
      coinRate: 200,
      description: "Fashion influencer with expertise in brand collaborations and content creation.",
      skills: ["Content Creation", "Brand Partnerships", "Photography"],
      verified: true
    },
    {
      id: "2",
      name: "David Chen",
      username: "@davidtech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviews: 93,
      followers: 32000,
      category: "Technology",
      location: "Abuja, Nigeria",
      coinRate: 180,
      description: "Tech reviewer and digital marketing specialist with strong engagement rates.",
      skills: ["Tech Reviews", "Digital Marketing", "Video Production"],
      verified: true
    },
    {
      id: "3",
      name: "Amara Okafor",
      username: "@amarafood",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviews: 156,
      followers: 28000,
      category: "Food & Lifestyle",
      location: "Port Harcourt, Nigeria",
      coinRate: 150,
      description: "Food blogger and lifestyle content creator with authentic storytelling.",
      skills: ["Food Photography", "Recipe Development", "Lifestyle Content"],
      verified: false
    },
    {
      id: "4",
      name: "Michael Brown",
      username: "@mikefitness",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviews: 201,
      followers: 67000,
      category: "Fitness & Health",
      location: "Lagos, Nigeria",
      coinRate: 220,
      description: "Fitness coach and wellness advocate with high engagement and conversion rates.",
      skills: ["Fitness Training", "Wellness Content", "Video Production"],
      verified: true
    },
    {
      id: "5",
      name: "Fatima Ahmed",
      username: "@fatimabeauty",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviews: 89,
      followers: 41000,
      category: "Beauty & Skincare",
      location: "Kano, Nigeria",
      coinRate: 170,
      description: "Beauty and skincare expert specializing in product reviews and tutorials.",
      skills: ["Beauty Tutorials", "Product Reviews", "Skincare Advice"],
      verified: false
    },
    {
      id: "6",
      name: "James Wilson",
      username: "@jamestravel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviews: 134,
      followers: 38000,
      category: "Travel & Adventure",
      location: "Lagos, Nigeria",
      coinRate: 190,
      description: "Travel photographer and adventure blogger with stunning visual content.",
      skills: ["Travel Photography", "Adventure Content", "Storytelling"],
      verified: true
    }
  ];

  const categories = [
    "All Categories",
    "Fashion & Lifestyle", 
    "Technology",
    "Food & Lifestyle",
    "Fitness & Health",
    "Beauty & Skincare",
    "Travel & Adventure"
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Influencer Marketplace</h1>
              <p className="text-muted-foreground">Connect with talented creators and influencers</p>
            </div>
          </div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search influencers..." 
              className="pl-10 bg-background/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select className="w-full pl-10 pr-4 py-2 bg-background/50 border border-input rounded-md text-sm">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <Button variant="hero">
            <Coins className="h-4 w-4 mr-2" />
            List Portfolio
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-card border-border/50 text-center">
            <div className="text-2xl font-bold text-primary">2,547</div>
            <div className="text-sm text-muted-foreground">Active Creators</div>
          </Card>
          <Card className="p-4 bg-gradient-card border-border/50 text-center">
            <div className="text-2xl font-bold text-success">₦4.2M</div>
            <div className="text-sm text-muted-foreground">Total Earned</div>
          </Card>
          <Card className="p-4 bg-gradient-card border-border/50 text-center">
            <div className="text-2xl font-bold text-accent">1,234</div>
            <div className="text-sm text-muted-foreground">Collaborations</div>
          </Card>
          <Card className="p-4 bg-gradient-card border-border/50 text-center">
            <div className="text-2xl font-bold text-secondary">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </Card>
        </div>

        {/* Influencer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={influencer.avatar} />
                      <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{influencer.name}</h3>
                        {influencer.verified && (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{influencer.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="text-sm font-medium">{influencer.rating}</span>
                      <span className="text-xs text-muted-foreground">({influencer.reviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {influencer.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{(influencer.followers / 1000).toFixed(0)}K followers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">{influencer.location}</span>
                  </div>
                </div>

                {/* Category and Skills */}
                <div className="space-y-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {influencer.category}
                  </Badge>
                  
                  <div className="flex flex-wrap gap-1">
                    {influencer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {influencer.coinRate} coins/post
                    </span>
                  </div>
                  <Button variant="hero" size="sm">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Creators
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
    </ProtectedRoute>
  );
};

export default Marketplace;

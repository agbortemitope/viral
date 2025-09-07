import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard, { ContentType } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus } from "lucide-react";

interface FeedItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  coinReward: number;
  image?: string;
  location?: string;
  date?: string;
  company?: string;
}

const Feed = () => {
  const [selectedFilter, setSelectedFilter] = useState<ContentType | "all">("all");
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  // Mock data
  useEffect(() => {
    const mockData: FeedItem[] = [
      {
        id: "1",
        type: "job",
        title: "Frontend Developer",
        description: "Join our dynamic team as a Frontend Developer. Work with React, TypeScript, and modern web technologies.",
        coinReward: 150,
        company: "TechCorp",
        location: "Lagos, Nigeria",
        image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=400&h=200&fit=crop"
      },
      {
        id: "2",
        type: "event",
        title: "Tech Startup Meetup",
        description: "Network with entrepreneurs and learn about the latest trends in technology and startups.",
        coinReward: 50,
        date: "Dec 15, 2024",
        location: "Victoria Island, Lagos",
        image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=200&fit=crop"
      },
      {
        id: "3",
        type: "ad",
        title: "New Smartphone Launch",
        description: "Discover the latest smartphone with advanced features and incredible performance. Limited time offer!",
        coinReward: 25,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop"
      },
      {
        id: "4",
        type: "property",
        title: "Modern 3BR Apartment",
        description: "Beautiful 3-bedroom apartment in a prime location with modern amenities and great views.",
        coinReward: 75,
        location: "Ikoyi, Lagos",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop"
      },
      {
        id: "5",
        type: "job",
        title: "Digital Marketing Specialist",
        description: "Help grow our brand through innovative digital marketing strategies and social media campaigns.",
        coinReward: 120,
        company: "MediaHub",
        location: "Abuja, Nigeria"
      },
      {
        id: "6",
        type: "event",
        title: "Business Workshop",
        description: "Learn essential business skills from industry experts. Topics include finance, marketing, and growth strategies.",
        coinReward: 80,
        date: "Dec 20, 2024",
        location: "Ikeja, Lagos"
      }
    ];
    setFeedItems(mockData);
  }, []);

  const filteredItems = selectedFilter === "all" 
    ? feedItems 
    : feedItems.filter(item => item.type === selectedFilter);

  const filters = [
    { key: "all" as const, label: "All", count: feedItems.length },
    { key: "ad" as const, label: "Ads", count: feedItems.filter(i => i.type === "ad").length },
    { key: "job" as const, label: "Jobs", count: feedItems.filter(i => i.type === "job").length },
    { key: "event" as const, label: "Events", count: feedItems.filter(i => i.type === "event").length },
    { key: "property" as const, label: "Properties", count: feedItems.filter(i => i.type === "property").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Opportunity Feed</h1>
            <p className="text-muted-foreground">
              Discover jobs, events, ads, and properties. Earn coins for every interaction!
            </p>
          </div>
          
          <Button variant="hero" size="lg" className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Ad
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          {filters.map((filter) => (
            <Badge
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFilter === filter.key 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedFilter(filter.key)}
            >
              {filter.label} ({filter.count})
            </Badge>
          ))}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <ContentCard key={item.id} {...item} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Content
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Feed;
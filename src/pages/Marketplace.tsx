import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, DollarSign } from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: "job" | "event" | "ad";
  location?: string;
  date?: string;
  price?: number;
  coins: number;
  company?: string;
  image?: string;
}

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "Frontend Developer Position",
    description: "Join our team as a Frontend Developer working with React and TypeScript",
    type: "job",
    location: "Remote",
    coins: 50,
    company: "Tech Corp"
  },
  {
    id: "2",
    title: "Marketing Conference 2024",
    description: "Annual marketing conference featuring industry leaders",
    type: "event",
    location: "New York, NY",
    date: "2024-03-15",
    coins: 25
  },
  {
    id: "3",
    title: "Premium Software Bundle",
    description: "Get 50% off our premium software suite",
    type: "ad",
    price: 199,
    coins: 30,
    company: "Software Solutions"
  }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job": return "bg-blue-100 text-blue-800";
      case "event": return "bg-green-100 text-green-800";
      case "ad": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-page">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-2">Marketplace</h1>
            <p className="text-text-secondary">Discover opportunities and earn coins</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedType === "job" ? "default" : "outline"}
                onClick={() => setSelectedType("job")}
                size="sm"
              >
                Jobs
              </Button>
              <Button
                variant={selectedType === "event" ? "default" : "outline"}
                onClick={() => setSelectedType("event")}
                size="sm"
              >
                Events
              </Button>
              <Button
                variant={selectedType === "ad" ? "default" : "outline"}
                onClick={() => setSelectedType("ad")}
                size="sm"
              >
                Ads
              </Button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                    <div className="flex items-center text-primary font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {item.coins}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.company && (
                    <CardDescription className="font-medium">{item.company}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-text-secondary text-sm">{item.description}</p>
                  
                  <div className="space-y-2">
                    {item.location && (
                      <div className="flex items-center text-sm text-text-secondary">
                        <MapPin className="h-4 w-4 mr-2" />
                        {item.location}
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center text-sm text-text-secondary">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    )}
                    {item.price && (
                      <div className="flex items-center text-sm text-text-secondary">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${item.price}
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Marketplace;
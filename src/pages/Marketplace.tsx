import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Coins, MapPin, Calendar, Search, Building, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  budget: number;
  reward_coins: number;
  image_url?: string;
  created_at: string;
}

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .in("status", ["approved", "active"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.content_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job": return "bg-success/20 text-success border-success/30";
      case "event": return "bg-accent/20 text-accent border-accent/30"; 
      case "ad": return "bg-primary/20 text-primary border-primary/30";
      case "property": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-page">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-page">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover opportunities and earn coins</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
              <Button
                variant={selectedType === "property" ? "default" : "outline"}
                onClick={() => setSelectedType("property")}
                size="sm"
              >
                Property
              </Button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center bg-gradient-card border-border/50">
                  <p className="text-muted-foreground">
                    No items found matching your criteria.
                  </p>
                </Card>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
                  {item.image_url && (
                    <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className={getTypeColor(item.content_type)}>
                        {item.content_type}
                      </Badge>
                      <div className="flex items-center space-x-1 bg-gradient-earnings px-2 py-1 rounded-full">
                        <Coins className="h-3 w-3" />
                        <span className="text-xs font-bold">{item.reward_coins}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="h-4 w-4 mr-2" />
                        Budget: ₦{item.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Marketplace;
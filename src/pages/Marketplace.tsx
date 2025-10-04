import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, MapPin, Calendar, Search, Building, Loader as Loader2, Star, DollarSign, Eye, FileText } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMarketplace } from "@/hooks/useMarketplace";

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
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { listings, loading, incrementViews, incrementContacts } = useMarketplace();

  const filteredItems = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.category === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (category: string) => {
    switch (category) {
      case "Design & Creative": return "bg-primary/20 text-primary border-primary/30";
      case "Web Development": return "bg-secondary/20 text-secondary border-secondary/30";
      case "Video & Animation": return "bg-accent/20 text-accent border-accent/30"; 
      case "Writing & Content": return "bg-success/20 text-success border-success/30";
      case "Marketing & SEO": return "bg-warning/20 text-warning border-warning/30";
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Creative Marketplace</h1>
            <p className="text-muted-foreground">Where brands find talented creators, designers, and developers</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search creative opportunities..."
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
                All Services
              </Button>
              <Button
                variant={selectedType === "Design & Creative" ? "default" : "outline"}
                onClick={() => setSelectedType("Design & Creative")}
                size="sm"
              >
                Design & Creative
              </Button>
              <Button
                variant={selectedType === "Web Development" ? "default" : "outline"}
                onClick={() => setSelectedType("Web Development")}
                size="sm"
              >
                Web Development
              </Button>
              <Button
                variant={selectedType === "Video & Animation" ? "default" : "outline"}
                onClick={() => setSelectedType("Video & Animation")}
                size="sm"
              >
                Video & Animation
              </Button>
              <Button
                variant={selectedType === "Writing & Content" ? "default" : "outline"}
                onClick={() => setSelectedType("Writing & Content")}
                size="sm"
              >
                Writing & Content
              </Button>
              <Button
                variant={selectedType === "Marketing & SEO" ? "default" : "outline"}
                onClick={() => setSelectedType("Marketing & SEO")}
                size="sm"
              >
                Marketing & SEO
              </Button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center bg-gradient-card border-border/50">
                  <p className="text-muted-foreground mb-2">
                    No services found matching your criteria.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check back soon for new service providers!
                  </p>
                </Card>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className={getTypeColor(item.category)}>
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1 bg-success/20 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-success" />
                        <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ₦{item.price_min.toLocaleString()} - ₦{item.price_max.toLocaleString()} / {item.pricing_type}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {item.location || 'Remote'} {item.remote_work && '• Remote Available'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 mr-2" />
                        {item.views_count} views • {item.contact_count} contacts
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        incrementViews(item.id);
                        setSelectedListing(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      View Details & Apply
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <Footer />

        {/* Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{selectedListing?.title}</DialogTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getTypeColor(selectedListing?.category)}>
                      {selectedListing?.category}
                    </Badge>
                    {selectedListing?.subcategory && (
                      <Badge variant="outline">{selectedListing.subcategory}</Badge>
                    )}
                    <div className="flex items-center space-x-1 bg-success/20 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-success" />
                      <span className="text-xs font-bold">{selectedListing?.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({selectedListing?.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">About This Service</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedListing?.description}</p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Pricing
                  </h4>
                  <p className="text-muted-foreground">
                    ₦{selectedListing?.price_min.toLocaleString()} - ₦{selectedListing?.price_max.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Per {selectedListing?.pricing_type}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedListing?.location || 'Remote'}
                  </p>
                  {selectedListing?.remote_work && (
                    <p className="text-sm text-success mt-1">✓ Remote work available</p>
                  )}
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Experience Level
                  </h4>
                  <p className="text-muted-foreground capitalize">
                    {selectedListing?.experience_level}
                  </p>
                </div>

                {selectedListing?.delivery_time && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Delivery Time
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedListing.delivery_time}
                    </p>
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedListing?.views_count} views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedListing?.contact_count} contacts
                  </span>
                </div>
              </div>

              {/* How to Apply */}
              {selectedListing?.application_instructions && (
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    How to Apply
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedListing.application_instructions}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full h-12 text-base" 
                onClick={() => {
                  incrementContacts(selectedListing?.id);
                  setIsDialogOpen(false);
                }}
              >
                Mark as Applied / Contacted
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default Marketplace;
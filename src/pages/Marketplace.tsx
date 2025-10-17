import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, MapPin, Calendar, Search, Building, Loader as Loader2, Star, DollarSign, Eye, FileText, Heart, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    experienceLevel: [] as string[],
    remoteWork: false,
    rating: 0,
    sortBy: "recent" as string,
  });
  const { user } = useAuth();
  const { listings, loading, incrementViews, incrementContacts } = useMarketplace();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('favorited_id')
        .eq('user_id', user?.id)
        .eq('favorited_type', 'listing');
      
      if (error) throw error;
      setFavorites(new Set(data?.map(f => f.favorited_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (listingId: string) => {
    try {
      if (favorites.has(listingId)) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user?.id)
          .eq('favorited_type', 'listing')
          .eq('favorited_id', listingId);
        
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user?.id,
            favorited_type: 'listing',
            favorited_id: listingId,
          });
        
        setFavorites(prev => new Set([...prev, listingId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredItems = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.category === selectedType;
    const matchesPrice = item.price_min >= filters.priceRange[0] &&
                         item.price_max <= filters.priceRange[1];
    const matchesExperience = filters.experienceLevel.length === 0 ||
                             filters.experienceLevel.includes(item.experience_level);
    const matchesRemote = !filters.remoteWork || item.remote_work;
    const matchesRating = item.rating >= filters.rating;
    
    return matchesSearch && matchesType && matchesPrice &&
           matchesExperience && matchesRemote && matchesRating;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price_min - b.price_min;
      case "price_high":
        return b.price_min - a.price_min;
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.views_count - a.views_count;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Marketplace</h1>
              <p className="text-sm md:text-base text-muted-foreground">Discover talented professionals and services</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 md:mb-8 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="flex gap-2 flex-wrap items-center">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                size="sm"
              >
                All
              </Button>
              <Input
                placeholder="Filter by category..."
                value={selectedType === "all" ? "" : selectedType}
                onChange={(e) => setSelectedType(e.target.value || "all")}
                className="max-w-xs"
              />
              <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <Card className="p-4 bg-gradient-card border-border/50">
                <h3 className="font-semibold mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({...filters, priceRange: value})}
                      max={100000}
                      step={1000}
                      className="mb-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <div className="space-y-2">
                      {['beginner', 'intermediate', 'expert'].map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={filters.experienceLevel.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({...filters, experienceLevel: [...filters.experienceLevel, level]});
                              } else {
                                setFilters({...filters, experienceLevel: filters.experienceLevel.filter(l => l !== level)});
                              }
                            }}
                          />
                          <label htmlFor={level} className="text-sm capitalize cursor-pointer">{level}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Additional Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={filters.remoteWork}
                          onCheckedChange={(checked) => setFilters({...filters, remoteWork: !!checked})}
                        />
                        <label htmlFor="remote" className="text-sm cursor-pointer">Remote work available</label>
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Minimum Rating: {filters.rating}+ stars</label>
                        <Slider
                          value={[filters.rating]}
                          onValueChange={(value) => setFilters({...filters, rating: value[0]})}
                          max={5}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      priceRange: [0, 100000],
                      experienceLevel: [],
                      remoteWork: false,
                      rating: 0,
                      sortBy: "recent",
                    })} 
                    size="sm"
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowFilters(false)} 
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{filteredItems.length === 0 ? (
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
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-1 bg-success/20 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-success" />
                          <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                          />
                        </Button>
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
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => {
                          incrementViews(item.id);
                          setSelectedListing(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      {item.profiles?.username && (
                        <Button 
                          variant="secondary"
                          onClick={() => window.location.href = `/marketplace/profile/${item.profiles.username || item.user_id}`}
                        >
                          Profile
                        </Button>
                      )}
                    </div>
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
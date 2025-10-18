import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";
import { 
  User, 
  DollarSign, 
  MapPin, 
  ExternalLink, 
  Mail,
  Star,
  Briefcase,
  FileText,
  Loader2,
  ArrowLeft,
  Heart
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  portfolio_title: string | null;
  portfolio_description: string | null;
  hourly_rate: number;
  available: boolean;
  skills: string[];
  categories: string[];
  email: string | null;
  phone_number: string | null;
  website_url: string | null;
  linkedin_url: string | null;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  category: string;
  tags: string[];
}

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price_min: number;
  price_max: number;
  pricing_type: string;
  rating: number;
  review_count: number;
  experience_level: string;
}

const MarketplaceProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (user && profile) {
      checkFavorite();
    }
  }, [user, profile]);

  const checkFavorite = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user?.id)
        .eq('favorited_type', 'creator')
        .eq('favorited_id', profile?.user_id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !profile) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('favorited_type', 'creator')
          .eq('favorited_id', profile.user_id);
        
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            favorited_type: 'creator',
            favorited_id: profile.user_id,
          });
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch profile by username or user_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${id},user_id.eq.${id}`)
        .eq('marketplace_enabled', true)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch portfolio items
      const { data: itemsData, error: itemsError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', profileData.user_id)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      setPortfolioItems(itemsData || []);

      // Fetch marketplace listing
      const { data: listingData, error: listingError } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('user_id', profileData.user_id)
        .eq('is_active', true)
        .single();

      if (listingError && listingError.code !== 'PGRST116') throw listingError;
      setListing(listingData);

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center p-8">
            <p className="text-muted-foreground mb-4">Profile not found or not available on marketplace</p>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/marketplace')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profile.full_name || profile.username || 'Professional'}</h1>
                    {profile.available && (
                      <Badge className="bg-success/20 text-success border-success/30">
                        Available for Work
                      </Badge>
                    )}
                    {user && user.id !== profile.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFavorite}
                      >
                        <Heart
                          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    )}
                  </div>
                  {profile.portfolio_title && (
                    <p className="text-lg text-muted-foreground">{profile.portfolio_title}</p>
                  )}
                </div>

                {listing && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-success" />
                      <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({listing.review_count} reviews)</span>
                    </div>
                    <Badge variant="outline">{listing.experience_level}</Badge>
                  </div>
                )}

                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <DollarSign className="h-5 w-5" />
                  ₦{profile.hourly_rate.toLocaleString()} / hour
                </div>

                {profile.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.categories.map(cat => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.portfolio_description && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {profile.portfolio_description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Items */}
            {portfolioItems.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map(item => (
                      <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            {item.project_url && (
                              <a 
                                href={item.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            {item.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Reviews Section */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="reviews">
                  <TabsList className="w-full">
                    <TabsTrigger value="reviews" className="flex-1">View Reviews</TabsTrigger>
                    {user && user.id !== profile.user_id && (
                      <TabsTrigger value="write" className="flex-1">Write Review</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="reviews" className="mt-4">
                    <ReviewsList revieweeId={profile.user_id} />
                  </TabsContent>
                  
                  {user && user.id !== profile.user_id && (
                    <TabsContent value="write" className="mt-4">
                      <ReviewForm 
                        revieweeId={profile.user_id} 
                        listingId={listing?.id}
                        onSuccess={() => {
                          fetchProfileData();
                        }}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.email && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a 
                      href={`mailto:${profile.email}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </a>
                  </div>
                )}
                
                {profile.phone_number && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{profile.phone_number}</p>
                  </div>
                )}

                {profile.website_url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <a 
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  </div>
                )}

                {profile.linkedin_url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">LinkedIn</p>
                    <a 
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Profile
                    </a>
                  </div>
                )}

                <Separator />

                <Button className="w-full" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Get in Touch
                </Button>
              </CardContent>
            </Card>

            {/* Service Listing */}
            {listing && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Price Range</p>
                    <p className="font-semibold">
                      ₦{listing.price_min.toLocaleString()} - ₦{listing.price_max.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Per {listing.pricing_type}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge className="mt-1">{listing.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplaceProfile;

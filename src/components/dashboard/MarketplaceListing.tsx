import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/hooks/useMarketplace";
import { 
  Store, 
  Edit, 
  Eye, 
  MessageCircle, 
  Star,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
  Plus
} from "lucide-react";

const categories = [
  "Design & Creative",
  "Web Development",
  "Mobile Development", 
  "Video & Animation",
  "Writing & Content",
  "Marketing & SEO",
  "Photography",
  "Consulting",
  "Data & Analytics",
  "Other"
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' }
];

const MarketplaceListing = () => {
  const { userListing, loading, createListing, updateListing } = useMarketplace();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price_min: 0,
    price_max: 0,
    pricing_type: "hourly" as "hourly" | "fixed" | "negotiable",
    availability: "available" as "available" | "busy" | "unavailable",
    location: "",
    remote_work: true,
    experience_level: "intermediate" as "beginner" | "intermediate" | "expert",
    delivery_time: "",
    is_active: true,
  });

  useEffect(() => {
    if (userListing) {
      setFormData({
        title: userListing.title,
        description: userListing.description,
        category: userListing.category,
        subcategory: userListing.subcategory || "",
        price_min: userListing.price_min,
        price_max: userListing.price_max,
        pricing_type: userListing.pricing_type,
        availability: userListing.availability,
        location: userListing.location || "",
        remote_work: userListing.remote_work,
        experience_level: userListing.experience_level,
        delivery_time: userListing.delivery_time || "",
        is_active: userListing.is_active,
      });
    }
  }, [userListing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (userListing) {
        await updateListing(userListing.id, formData);
      } else {
        await createListing(formData);
      }
      setEditing(false);
    } catch (error) {
      console.error('Error saving listing:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-success/20 text-success border-success/30';
      case 'busy': return 'bg-accent/20 text-accent border-accent/30';
      case 'unavailable': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Marketplace Listing
              </CardTitle>
              <CardDescription>
                Create your professional listing to attract clients and showcase your services.
              </CardDescription>
            </div>
            {userListing && !editing && (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </Button>
            )}
            {!userListing && !editing && (
              <Button onClick={() => setEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userListing && !editing ? (
            // Display existing listing
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{userListing.title}</h3>
                  <p className="text-muted-foreground mt-1">{userListing.description}</p>
                </div>
                <Badge className={getAvailabilityColor(userListing.availability)}>
                  {userListing.availability}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    ₦{userListing.price_min} - ₦{userListing.price_max} / {userListing.pricing_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userListing.location || 'Remote'} {userListing.remote_work && '• Remote OK'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userListing.delivery_time || 'Flexible'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{userListing.views_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="h-4 w-4 text-secondary" />
                    <span className="text-2xl font-bold text-foreground">{userListing.contact_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Contacts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-2xl font-bold text-foreground">
                      {userListing.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userListing.review_count} reviews
                  </p>
                </div>
              </div>
            </div>
          ) : editing ? (
            // Edit/Create form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Professional Web Development Services"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your services, experience, and what clients can expect..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price_min">Min Price (₦) *</Label>
                  <Input
                    id="price_min"
                    type="number"
                    value={formData.price_min}
                    onChange={(e) => setFormData({ ...formData, price_min: parseFloat(e.target.value) || 0 })}
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price_max">Max Price (₦) *</Label>
                  <Input
                    id="price_max"
                    type="number"
                    value={formData.price_max}
                    onChange={(e) => setFormData({ ...formData, price_max: parseFloat(e.target.value) || 0 })}
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricing_type">Pricing Type</Label>
                  <Select 
                    value={formData.pricing_type} 
                    onValueChange={(value: "hourly" | "fixed" | "negotiable") => 
                      setFormData({ ...formData, pricing_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value: "beginner" | "intermediate" | "expert") => 
                      setFormData({ ...formData, experience_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="delivery_time">Typical Delivery Time</Label>
                  <Input
                    id="delivery_time"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                    placeholder="e.g., 1-2 weeks"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Lagos, Nigeria"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value: "available" | "busy" | "unavailable") => 
                      setFormData({ ...formData, availability: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    Remote Work Available
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Can you work remotely with clients?
                  </p>
                </div>
                <Switch
                  checked={formData.remote_work}
                  onCheckedChange={(checked) => setFormData({ ...formData, remote_work: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    Active Listing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show your listing in the marketplace
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {userListing ? 'Update Listing' : 'Create Listing'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // No listing state
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Create Your Marketplace Listing
              </h3>
              <p className="text-muted-foreground mb-4">
                Showcase your services and attract potential clients
              </p>
              <Button onClick={() => setEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceListing;
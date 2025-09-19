import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface CreateAdModalProps {
  onAdCreated?: () => void;
}

const CreateAdModal = ({ onAdCreated }: CreateAdModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_type: "",
    reward_coins: "",
    budget: "",
    target_audience: "",
    location: "",
    contact_info: "",
    image_url: "",
    price: "", // product
    event_date: "", // event
    job_type: "", // job
    property_type: "", // property
  });

  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast({
        title: "Session expired",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content_type) {
      toast({
        title: "Missing category",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    // category-specific validation
    if (formData.content_type === "product" && !formData.price) {
      toast({
        title: "Missing price",
        description: "Products must include a price.",
        variant: "destructive",
      });
      return;
    }
    if (formData.content_type === "event" && !formData.event_date) {
      toast({
        title: "Missing date",
        description: "Events must include a date.",
        variant: "destructive",
      });
      return;
    }
    if (formData.content_type === "job" && !formData.job_type) {
      toast({
        title: "Missing job type",
        description: "Jobs must specify a job type.",
        variant: "destructive",
      });
      return;
    }
    if (formData.content_type === "property" && !formData.property_type) {
      toast({
        title: "Missing property type",
        description: "Properties must specify a type.",
        variant: "destructive",
      });
      return;
    }

    const budget = parseInt(formData.budget, 10);
    const rewardCoins = parseInt(formData.reward_coins, 10) || 0;

    if (isNaN(budget) || budget < 1) {
      toast({
        title: "Invalid budget",
        description: "Budget must be at least 1 coin.",
        variant: "destructive",
      });
      return;
    }

    if (profile.coins < budget) {
      toast({
        title: "Insufficient coins",
        description: "You don't have enough coins to create this ad.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: adData, error: adError } = await supabase
        .from("content")
        .insert({
          ...formData,
          reward_coins: rewardCoins,
          budget,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (adError) throw adError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins - budget })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_type: "spend",
        amount: -budget,
        description: `Created ${formData.content_type}: ${formData.title}`,
        content_id: adData?.id,
      });

      toast({
        title: "Ad created successfully!",
        description: "Your ad is now pending approval.",
      });

      setFormData({
        title: "",
        description: "",
        content_type: "",
        reward_coins: "",
        budget: "",
        target_audience: "",
        location: "",
        contact_info: "",
        image_url: "",
        price: "",
        event_date: "",
        job_type: "",
        property_type: "",
      });
      setOpen(false);

      refetchProfile();
      onAdCreated?.();
    } catch (error: any) {
      toast({
        title: "Error creating ad",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryFields = () => {
    switch (formData.content_type) {
      case "job":
        return (
          <div>
            <Label htmlFor="job_type">Job Type *</Label>
            <Input
              id="job_type"
              value={formData.job_type}
              onChange={(e) =>
                setFormData({ ...formData, job_type: e.target.value })
              }
              placeholder="e.g., Full-time, Part-time"
            />
          </div>
        );
      case "event":
        return (
          <div>
            <Label htmlFor="event_date">Event Date *</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value })
              }
            />
          </div>
        );
      case "property":
        return (
          <div>
            <Label htmlFor="property_type">Property Type *</Label>
            <Input
              id="property_type"
              value={formData.property_type}
              onChange={(e) =>
                setFormData({ ...formData, property_type: e.target.value })
              }
              placeholder="e.g., Apartment, Office Space"
            />
          </div>
        );
      case "product":
        return (
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Enter product price"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter ad title"
                required
              />
            </div>
            <div>
              <Label htmlFor="content_type">Category *</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, content_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="ad">Advertisement</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your ad in detail..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Category-Specific Fields */}
          {renderCategoryFields()}

          {/* Location & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, State or Address"
              />
            </div>
            <div>
              <Label htmlFor="contact_info">Contact Info</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) =>
                  setFormData({ ...formData, contact_info: e.target.value })
                }
                placeholder="Email or Phone"
              />
            </div>
          </div>

          {/* Image Input */}
          <div>
            <Label htmlFor="image_url">Image (Optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Reward & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reward_coins">Reward per Interaction</Label>
              <Input
                id="reward_coins"
                type="number"
                min="0"
                value={formData.reward_coins}
                onChange={(e) =>
                  setFormData({ ...formData, reward_coins: e.target.value })
                }
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (Coins) *</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="100"
                required
              />
              {profile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Available: {profile.coins} coins
                </p>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) =>
                setFormData({ ...formData, target_audience: e.target.value })
              }
              placeholder="e.g., Students, Professionals, Remote Workers"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !user}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ad"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdModal;

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
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface CreateAdModalProps {
  onAdCreated?: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    image_url: "",
    image_file: null as File | null,
  });

  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFormData({ ...formData, image_file: null });
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Max file size is 2MB.",
        variant: "destructive",
      });
      return;
    }

    setFormData({ ...formData, image_file: file });
  };

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
        title: "Missing ad type",
        description: "Please select an ad type.",
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
      let finalImageUrl = formData.image_url;

      // If a file was uploaded, store it in Supabase storage
      if (formData.image_file) {
        const fileName = `${user.id}-${Date.now()}-${formData.image_file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("ads")
          .upload(fileName, formData.image_file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("ads")
          .getPublicUrl(uploadData.path);

        finalImageUrl = publicUrl.publicUrl;
      }

      // Create the ad
      const { error: adError } = await supabase.from("content").insert({
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        reward_coins: rewardCoins,
        budget,
        target_audience: formData.target_audience,
        image_url: finalImageUrl || null,
        user_id: user.id,
        status: "pending",
      });

      if (adError) throw adError;

      // Deduct coins from user's profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins - budget })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_type: "spend",
        amount: budget,
        description: `Created ${formData.content_type}: ${formData.title}`,
      });

      toast({
        title: "Ad created successfully!",
        description: "Your ad is now pending approval.",
      });

      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        content_type: "",
        reward_coins: "",
        budget: "",
        target_audience: "",
        image_url: "",
        image_file: null,
      });
      setOpen(false);

      // Refresh profile and trigger callback
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
          {/* Title & Type */}
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
              <Label htmlFor="content_type">Type *</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, content_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job Listing</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="ad">Advertisement</SelectItem>
                  <SelectItem value="property">Property Listing</SelectItem>
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
            <div className="mt-2">
              <Input
                id="image_file"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>

            {/* Image Preview */}
            {(formData.image_url || formData.image_file) && (
              <div className="mt-4">
                <Label>Preview</Label>
                <img
                  src={
                    formData.image_file
                      ? URL.createObjectURL(formData.image_file)
                      : formData.image_url
                  }
                  alt="Preview"
                  className="mt-2 max-h-48 rounded border"
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
              {loading ? "Creating..." : "Create Ad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdModal;
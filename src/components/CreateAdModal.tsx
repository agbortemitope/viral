import { useState, useEffect } from "react";
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

const CATEGORY_FIELDS: Record<string, { label: string; type: "text" | "textarea" | "number" | "url"; required?: boolean }[]> = {
  job: [
    { label: "Job Title", type: "text", required: true },
    { label: "Job Description", type: "textarea", required: true },
    { label: "Location", type: "text" },
    { label: "Salary Range", type: "text" },
    { label: "Contact Info", type: "text", required: true },
  ],
  event: [
    { label: "Event Title", type: "text", required: true },
    { label: "Event Description", type: "textarea", required: true },
    { label: "Location", type: "text", required: true },
    { label: "Date & Time", type: "text", required: true },
    { label: "Contact Info", type: "text" },
  ],
  ad: [
    { label: "Ad Title", type: "text", required: true },
    { label: "Ad Description", type: "textarea", required: true },
    { label: "Target Audience", type: "text" },
    { label: "Contact Info", type: "text" },
    { label: "Image URL", type: "url" },
  ],
  property: [
    { label: "Property Title", type: "text", required: true },
    { label: "Property Description", type: "textarea", required: true },
    { label: "Location", type: "text", required: true },
    { label: "Price", type: "number", required: true },
    { label: "Contact Info", type: "text" },
    { label: "Image URL", type: "url" },
  ],
  product: [
    { label: "Product Name", type: "text", required: true },
    { label: "Description", type: "textarea", required: true },
    { label: "Price", type: "number", required: true },
    { label: "Stock Quantity", type: "number", required: true },
    { label: "Image URL", type: "url" },
  ],
};

const CreateAdModal = ({ onAdCreated }: CreateAdModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [contentType, setContentType] = useState("");

  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();

  // Listen for updates to ads (e.g. approval/rejection)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("content-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "content", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updatedAd = payload.new as any;
          toast({
            title: "Ad Update",
            description: `Your ad "${updatedAd.title}" is now ${updatedAd.status}.`,
          });
          onAdCreated?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onAdCreated, toast]);

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

    if (!contentType) {
      toast({
        title: "Missing category",
        description: "Please select a category for your ad.",
        variant: "destructive",
      });
      return;
    }

    const budget = parseInt(formData.budget || "0", 10);
    const rewardCoins = parseInt(formData.reward_coins || "0", 10);

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
          title: formData.title || "",
          description: formData.description || "",
          content_type: contentType,
          reward_coins: rewardCoins,
          budget,
          target_audience: formData.target_audience || "",
          location: formData.location || "",
          contact_info: formData.contact_info || "",
          image_url: formData.image_url || null,
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
        description: `Created ${contentType}: ${formData.title}`,
        content_id: adData?.id,
      });

      toast({
        title: "Ad created successfully!",
        description: "Your ad is now pending approval.",
      });

      setFormData({});
      setContentType("");
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

  const categoryFields = CATEGORY_FIELDS[contentType] || [];

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
          {/* Category Selector */}
          <div>
            <Label htmlFor="content_type">Category *</Label>
            <Select
              value={contentType}
              onValueChange={(value) => {
                setContentType(value);
                setFormData({});
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Job Listing</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="ad">Advertisement</SelectItem>
                <SelectItem value="property">Property Listing</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields */}
          {categoryFields.map((field) => (
            <div key={field.label}>
              <Label>{field.label}{field.required ? " *" : ""}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={formData[field.label.toLowerCase().replace(/\s+/g, "_")] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.label.toLowerCase().replace(/\s+/g, "_")]: e.target.value,
                    })
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              ) : (
                <Input
                  type={field.type}
                  value={formData[field.label.toLowerCase().replace(/\s+/g, "_")] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.label.toLowerCase().replace(/\s+/g, "_")]: e.target.value,
                    })
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {/* Reward & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reward_coins">Reward per Interaction</Label>
              <Input
                id="reward_coins"
                type="number"
                min="0"
                value={formData.reward_coins || ""}
                onChange={(e) => setFormData({ ...formData, reward_coins: e.target.value })}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (Coins) *</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                value={formData.budget || ""}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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

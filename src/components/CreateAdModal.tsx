import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

interface CreateAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateAdModal = ({ open, onOpenChange, onSuccess }: CreateAdModalProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adType, setAdType] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    rewardCoins: "",
    targetAudience: "",
    imageUrl: "",
    jobType: "",
    salary: "",
    location: "",
    eventDate: "",
    venue: "",
    ticketPrice: "",
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    productPrice: "",
    productCategory: "",
    taskDeadline: "",
    taskPayment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !adType) {
      toast({
        title: "Missing information",
        description: "Please select an ad type and fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const budget = parseInt(formData.budget);
    const rewardCoins = parseInt(formData.rewardCoins);

    if (budget <= 0 || rewardCoins <= 0) {
      toast({
        title: "Invalid values",
        description: "Budget and reward coins must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (budget > (profile?.coins || 0)) {
      toast({
        title: "Insufficient coins",
        description: `You need ${budget} coins but only have ${profile?.coins || 0} coins`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error: contentError } = await supabase
        .from("content")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          content_type: adType,
          budget: budget,
          reward_coins: rewardCoins,
          target_audience: formData.targetAudience,
          image_url: formData.imageUrl,
          status: "active",
          reach_count: 0,
        });

      if (contentError) throw contentError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          coins: (profile?.coins || 0) - budget 
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_type: "spend",
        amount: -budget,
        description: `Created ${adType} ad: ${formData.title}`,
        status: "completed",
      });

      toast({
        title: "Ad created successfully!",
        description: `Your ${adType} has been posted to the feed`,
      });

      setFormData({
        title: "",
        description: "",
        budget: "",
        rewardCoins: "",
        targetAudience: "",
        imageUrl: "",
        jobType: "",
        salary: "",
        location: "",
        eventDate: "",
        venue: "",
        ticketPrice: "",
        propertyType: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        productPrice: "",
        productCategory: "",
        taskDeadline: "",
        taskPayment: "",
      });
      setAdType("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
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

  const renderAdTypeFields = () => {
    switch (adType) {
      case "job":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={formData.jobType} onValueChange={(value) => setFormData({...formData, jobType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $50,000 - $70,000"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </>
        );
      
      case "event":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                placeholder="Event location"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Ticket Price (optional)</Label>
              <Input
                id="ticketPrice"
                type="number"
                placeholder="Free or ticket price"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
              />
            </div>
          </>
        );

      case "property":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Property price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="Number of bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="Number of bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                />
              </div>
            </div>
          </>
        );

      case "product":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Product Category</Label>
              <Input
                id="productCategory"
                placeholder="e.g., Electronics, Fashion, Home"
                value={formData.productCategory}
                onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Product Price</Label>
              <Input
                id="productPrice"
                type="number"
                placeholder="Price"
                value={formData.productPrice}
                onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                required
              />
            </div>
          </>
        );

      case "paid_task":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="taskPayment">Task Payment</Label>
              <Input
                id="taskPayment"
                type="number"
                placeholder="Payment amount"
                value={formData.taskPayment}
                onChange={(e) => setFormData({...formData, taskPayment: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDeadline">Deadline</Label>
              <Input
                id="taskDeadline"
                type="date"
                value={formData.taskDeadline}
                onChange={(e) => setFormData({...formData, taskDeadline: e.target.value})}
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ad</DialogTitle>
          <DialogDescription>
            Post your ad to the feed. Users will see it and you'll pay from your coin balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adType">Ad Type *</Label>
            <Select value={adType} onValueChange={setAdType}>
              <SelectTrigger>
                <SelectValue placeholder="Select ad type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="job">Job Posting</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="paid_task">Paid Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {adType && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Ad title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your offering"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                />
              </div>

              {renderAdTypeFields()}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Total Budget (coins) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your balance: {profile?.coins || 0} coins
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewardCoins">Reward per Interaction *</Label>
                  <Input
                    id="rewardCoins"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.rewardCoins}
                    onChange={(e) => setFormData({...formData, rewardCoins: e.target.value})}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience (optional)</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Tech professionals, Students"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ad"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdModal;

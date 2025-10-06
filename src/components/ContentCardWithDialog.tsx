import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Coins,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

interface ContentCardWithDialogProps {
  title?: string;
  description?: string;
  type?: "job" | "event" | "ad" | "property";
  coins?: number;
  image?: string;
  location?: string;
  contactInfo?: string;
  onInteraction?: () => Promise<void>;
  loading?: boolean;
  hasInteracted?: boolean;
}

const ContentCardWithDialog = ({
  title,
  description,
  type,
  coins = 0,
  image,
  location,
  contactInfo,
  onInteraction,
  loading = false,
  hasInteracted = false,
}: ContentCardWithDialogProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInteraction = async () => {
    if (!onInteraction || hasInteracted || isInteracting) return;

    setIsInteracting(true);
    try {
      await onInteraction();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error during interaction:", error);
    } finally {
      setIsInteracting(false);
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "job":
        return "bg-success/20 text-success border-success/30";
      case "event":
        return "bg-accent/20 text-accent border-accent/30";
      case "property":
        return "bg-secondary/20 text-secondary border-secondary/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getTypeName = () => {
    switch (type) {
      case "job":
        return "Job";
      case "event":
        return "Event";
      case "property":
        return "Property";
      default:
        return "Ad";
    }
  };

  const isEmail = (contact: string) => contact?.includes('@') || false;

  if (loading) {
    return (
      <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div
            className="h-5 w-16 bg-muted rounded-full animate-pulse"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="h-5 w-10 bg-muted rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <div
          className="w-full h-32 md:h-48 bg-muted rounded-md mb-4 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <div className="space-y-3">
          <div
            className="h-5 w-2/3 bg-muted rounded animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className="h-4 w-full bg-muted rounded animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="h-4 w-5/6 bg-muted rounded animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="h-9 w-full bg-muted rounded mt-4 animate-pulse"
            style={{ animationDelay: "0.7s" }}
          />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4 md:p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20 group">
        <div className="flex items-start justify-between mb-4">
          <Badge className={getTypeColor()}>{getTypeName()}</Badge>
          {coins > 0 && (
            <div className="flex items-center space-x-1 bg-gradient-earnings px-2 md:px-3 py-1 rounded-full">
              <Coins className="h-3 md:h-4 w-3 md:w-4 text-accent-foreground" />
              <span className="text-xs md:text-sm font-bold text-accent-foreground">
                {coins}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 rounded-lg overflow-hidden">
          {image && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="w-full h-32 md:h-48 animate-pulse bg-muted rounded-md" />
              )}
              <img
                src={image}
                alt={title}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-32 md:h-48 object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute"
                }`}
              />
            </>
          ) : (
            <div className="w-full h-32 md:h-48 flex items-center justify-center bg-muted text-muted-foreground rounded-md border">
              <ImageIcon className="h-6 md:h-8 w-6 md:w-8" />
            </div>
          )}
        </div>

        <div className="space-y-2 md:space-y-3">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm md:text-base text-muted-foreground line-clamp-2">{description}</p>

          {/* Location and Contact Info */}
          <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {contactInfo && (
              <div className="flex items-center gap-1">
                {isEmail(contactInfo) ? (
                  <Mail className="h-3 w-3" />
                ) : (
                  <Phone className="h-3 w-3" />
                )}
                <span className="truncate max-w-[150px]">{contactInfo}</span>
              </div>
            )}
          </div>

          {coins > 0 && (
            <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
              <Coins className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              <span>Earn {coins} coins for interacting</span>
            </div>
          )}

          <Button
            variant={hasInteracted ? "secondary" : "earnings"}
            size="sm"
            className="mt-4 w-full cursor-pointer text-sm md:text-base"
            onClick={() => setIsDialogOpen(true)}
            disabled={hasInteracted}
            style={hasInteracted ? { pointerEvents: 'none', opacity: 0.6 } : {}}
          >
            {hasInteracted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                Get More Info
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Full Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
            <DialogDescription className="sr-only">Full details about this opportunity</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6">
            {/* Image */}
            {image && !imageError && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            )}

            {/* Type Badge */}
            <Badge className={getTypeColor()}>{getTypeName()}</Badge>

            {/* Full Description */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-2">Full Description</h4>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {location && (
                <div className="bg-muted/30 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm md:text-base">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground">{location}</p>
                </div>
              )}
              
              {contactInfo && (
                <div className="bg-muted/30 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm md:text-base">
                    {isEmail(contactInfo) ? (
                      <>
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 text-primary" />
                        Phone
                      </>
                    )}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground break-all">{contactInfo}</p>
                </div>
              )}
            </div>

            {/* Coins Reward */}
            {coins > 0 && (
              <div className="bg-primary/10 p-3 md:p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm md:text-base">Earn Coins</span>
                  </div>
                  <span className="text-lg md:text-2xl font-bold text-primary">{coins} coins</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Complete this interaction to earn coins instantly
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleInteraction}
              disabled={isInteracting || hasInteracted}
              className="w-full"
              size="lg"
            >
              {isInteracting ? (
                "Processing..."
              ) : hasInteracted ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Already Completed
                </>
              ) : (
                <>
                  Complete Interaction & Earn {coins} Coins
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCardWithDialog;

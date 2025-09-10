import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface ContentCardProps {
  title?: string;
  description?: string;
  type?: "job" | "event" | "ad" | "property";
  coins?: number;
  image?: string;
  onInteraction?: () => Promise<void>;
  loading?: boolean;
}

const ContentCard = ({
  title,
  description,
  type,
  coins = 0,
  image,
  onInteraction,
  loading = false,
}: ContentCardProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleInteraction = async () => {
    if (!onInteraction || hasInteracted) return;

    setIsInteracting(true);
    try {
      await onInteraction();
      setHasInteracted(true);
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

  if (loading) {
    // Skeleton loader mode
    return (
      <Card className="p-6 bg-gradient-card border-border/50 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-10 bg-muted rounded-full" />
        </div>
        <div className="w-full h-48 bg-muted rounded-md mb-4" />
        <div className="space-y-3">
          <div className="h-5 w-2/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-9 w-full bg-muted rounded mt-4" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <Badge className={getTypeColor()}>{getTypeName()}</Badge>
        {coins > 0 && (
          <div className="flex items-center space-x-1 bg-gradient-earnings px-3 py-1 rounded-full">
            <Coins className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-bold text-accent-foreground">
              {coins}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-lg overflow-hidden">
        {image && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="w-full h-48 animate-pulse bg-muted rounded-md" />
            )}
            <img
              src={image}
              alt={title}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-muted text-muted-foreground rounded-md border">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground line-clamp-3">{description}</p>

        {coins > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            <span>Earn {coins} coins for interacting</span>
          </div>
        )}

        <Button
          variant={hasInteracted ? "secondary" : "earnings"}
          size="sm"
          className="mt-4 w-full"
          onClick={handleInteraction}
          disabled={isInteracting || hasInteracted}
        >
          {isInteracting ? (
            <>Loading...</>
          ) : hasInteracted ? (
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
  );
};

export default ContentCard;
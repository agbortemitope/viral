import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowRight } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  type: "job" | "event" | "ad" | "property";
  coins: number;
  image?: string;
  onInteraction?: () => void;
}

const ContentCard = ({ title, description, type, coins, image, onInteraction }: ContentCardProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "job": return "bg-success/20 text-success border-success/30";
      case "event": return "bg-accent/20 text-accent border-accent/30";
      case "property": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getTypeName = () => {
    switch (type) {
      case "job": return "Job";
      case "event": return "Event";
      case "property": return "Property";
      default: return "Ad";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <Badge className={getTypeColor()}>
          {getTypeName()}
        </Badge>
        {coins > 0 && (
          <div className="flex items-center space-x-1 bg-gradient-earnings px-3 py-1 rounded-full">
            <Coins className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-bold text-accent-foreground">{coins}</span>
          </div>
        )}
      </div>

      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        {coins > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            <span>Earn {coins} coins for interacting</span>
          </div>
        )}
        
        <Button 
          variant="earnings" 
          size="sm" 
          className="mt-4 w-full"
          onClick={onInteraction}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          Get More Info
        </Button>
      </div>
    </Card>
  );
};

export default ContentCard;
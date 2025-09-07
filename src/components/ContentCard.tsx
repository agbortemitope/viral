import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, MapPin, Calendar, Briefcase, Home, Megaphone } from "lucide-react";

export type ContentType = "ad" | "job" | "event" | "property";

interface ContentCardProps {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  coinReward: number;
  image?: string;
  location?: string;
  date?: string;
  company?: string;
}

const ContentCard = ({ 
  id, 
  type, 
  title, 
  description, 
  coinReward, 
  image, 
  location, 
  date, 
  company 
}: ContentCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "job": return <Briefcase className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "property": return <Home className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

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
    <Card className="overflow-hidden bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20 group">
      {/* Rounded top corners with slight triangle effect */}
      <div className="relative">
        {image ? (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <Badge className={`absolute top-3 left-3 ${getTypeColor()}`}>
              {getTypeIcon()}
              <span className="ml-1">{getTypeName()}</span>
            </Badge>
            <div className="absolute top-3 right-3 bg-gradient-earnings px-2 py-1 rounded-full flex items-center space-x-1">
              <Coins className="h-3 w-3 text-accent-foreground" />
              <span className="text-xs font-bold text-accent-foreground">{coinReward}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 pb-0">
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${getTypeColor()}`}>
                {getTypeIcon()}
                <span className="ml-1">{getTypeName()}</span>
              </Badge>
              <div className="bg-gradient-earnings px-3 py-1 rounded-full flex items-center space-x-1">
                <Coins className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm font-bold text-accent-foreground">{coinReward}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        {/* Meta information */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          {company && (
            <span className="flex items-center space-x-1">
              <Briefcase className="h-3 w-3" />
              <span>{company}</span>
            </span>
          )}
          {location && (
            <span className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </span>
          )}
          {date && (
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </span>
          )}
        </div>

        <Button 
          variant="hero" 
          className="w-full"
          onClick={() => console.log(`Clicked on ${type} ${id}`)}
        >
          {type === "job" ? "Apply Now" : 
           type === "event" ? "Get More Info" : 
           type === "property" ? "View Details" : 
           "Learn More"}
        </Button>
      </div>
    </Card>
  );
};

export default ContentCard;
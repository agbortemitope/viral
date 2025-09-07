import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: "primary" | "success" | "accent" | "secondary";
}

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  iconColor 
}: MetricsCardProps) => {
  const iconColorClasses = {
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    accent: "bg-accent/20 text-accent",
    secondary: "bg-secondary/20 text-secondary",
  };

  const changeColorClasses = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className={cn("text-sm font-medium", changeColorClasses[changeType])}>
            {change}
          </p>
        </div>
        <div className={cn("p-3 rounded-lg", iconColorClasses[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;
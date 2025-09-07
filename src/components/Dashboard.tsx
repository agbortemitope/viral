import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetricsCard from "./MetricsCard";
import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  Download,
  Settings,
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Earnings",
      value: "$2,847.50",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "success" as const,
    },
    {
      title: "Ad Views",
      value: "143.2K",
      change: "+18.2% from last week",
      changeType: "positive" as const,
      icon: Eye,
      iconColor: "primary" as const,
    },
    {
      title: "Click Rate",
      value: "4.8%",
      change: "+0.3% from last week",
      changeType: "positive" as const,
      icon: MousePointer,
      iconColor: "accent" as const,
    },
    {
      title: "Engagement Score",
      value: "94.2",
      change: "Stable performance",
      changeType: "neutral" as const,
      icon: TrendingUp,
      iconColor: "secondary" as const,
    },
  ];

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Creator Dashboard</h2>
            <p className="text-muted-foreground mt-2">
              Track your earnings and engagement metrics in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>
        
        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Chart */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Earnings Overview
              </h3>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mock chart area */}
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive earnings chart will appear here
                </p>
              </div>
            </div>
          </Card>
          
          {/* Recent Activity */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {[
                { action: "Ad Click", amount: "+$2.50", time: "2 min ago" },
                { action: "Video View", amount: "+$0.75", time: "5 min ago" },
                { action: "Engagement Bonus", amount: "+$5.00", time: "1 hour ago" },
                { action: "Ad Click", amount: "+$1.25", time: "2 hours ago" },
                { action: "Share Reward", amount: "+$3.00", time: "3 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-success">
                    {activity.amount}
                  </span>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-primary">
              View All Activity
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Coins, 
  Target,
  Calendar
} from "lucide-react";

interface AnalyticsData {
  totalEarnings: number;
  totalInteractions: number;
  adViews: number;
  conversionRate: number;
  monthlyEarnings: number[];
  topPerformingContent: any[];
}

const Analytics = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalEarnings: 0,
    totalInteractions: 0,
    adViews: 0,
    conversionRate: 0,
    monthlyEarnings: [],
    topPerformingContent: []
  });
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(endDate.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch transactions for earnings
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Fetch interactions
      const { data: interactions } = await supabase
        .from("user_interactions")
        .select("*")
        .eq("user_id", user?.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Fetch user's content performance
      const { data: userContent } = await supabase
        .from("content")
        .select(`
          *,
          user_interactions(count)
        `)
        .eq("user_id", user?.id);

      const totalEarnings = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalInteractions = interactions?.length || 0;
      const adViews = interactions?.filter(i => i.interaction_type === 'view').length || 0;
      const conversionRate = adViews > 0 ? (totalInteractions / adViews) * 100 : 0;

      setAnalyticsData({
        totalEarnings,
        totalInteractions,
        adViews,
        conversionRate,
        monthlyEarnings: generateMonthlyEarnings(transactions || []),
        topPerformingContent: userContent?.slice(0, 5) || []
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyEarnings = (transactions: any[]) => {
    const monthlyData = new Array(12).fill(0);
    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        const month = new Date(transaction.created_at).getMonth();
        monthlyData[month] += transaction.amount;
      }
    });
    return monthlyData;
  };

  const analyticsCards = [
    {
      title: "Total Earnings",
      value: `${analyticsData.totalEarnings} coins`,
      change: "+12.5%",
      icon: Coins,
      color: "text-success"
    },
    {
      title: "Total Interactions",
      value: analyticsData.totalInteractions.toString(),
      change: "+8.2%",
      icon: MousePointer,
      color: "text-primary"
    },
    {
      title: "Ad Views",
      value: analyticsData.adViews.toString(),
      change: "+15.3%",
      icon: Eye,
      color: "text-accent"
    },
    {
      title: "Conversion Rate",
      value: `${analyticsData.conversionRate.toFixed(1)}%`,
      change: "+2.1%",
      icon: Target,
      color: "text-secondary"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance and earnings</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
              <TabsTrigger value="90d">90 days</TabsTrigger>
              <TabsTrigger value="1y">1 year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className={`text-sm font-medium ${card.color}`}>{card.change}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Earnings Trend</h3>
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive earnings chart</p>
            </div>
          </div>
        </Card>

        {/* Interaction Types */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Interaction Types</h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Ad Clicks</span>
              <span className="font-semibold text-primary">{analyticsData.totalInteractions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Views</span>
              <span className="font-semibold text-accent">{analyticsData.adViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Conversions</span>
              <span className="font-semibold text-success">{Math.round(analyticsData.totalInteractions * 0.3)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Top Performing Content</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        {analyticsData.topPerformingContent.length > 0 ? (
          <div className="space-y-4">
            {analyticsData.topPerformingContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
                <div>
                  <p className="font-medium text-foreground">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.content_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{content.reward_coins} coins</p>
                  <p className="text-sm text-muted-foreground">{content.reach_count} views</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No content data available yet</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetricsCard from "@/components/MetricsCard";
import CreateAdModal from "@/components/CreateAdModal";
import AccountSettings from "@/components/dashboard/AccountSettings";
import Portfolio from "@/components/dashboard/Portfolio";
import Analytics from "@/components/dashboard/Analytics";
import AdvertiserAnalytics from "@/components/dashboard/AdvertiserAnalytics";
import DashboardCalendar from "@/components/dashboard/Calendar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { User, ChartBar as BarChart3, Briefcase, Coins, Eye, MousePointer, TrendingUp, Calendar, Settings, CreditCard as Edit3, Star, Award, Plus, Briefcase as PortfolioIcon } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [userContent, setUserContent] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [createAdOpen, setCreateAdOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async (days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch user's content
      const { data: contentData } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", user?.id);

      // Fetch user's transactions with date filter
      const { data: transactionData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch recent activity (interactions + transactions)
      const { data: interactionData } = await supabase
        .from("user_interactions")
        .select(`
          *,
          content:content_id (title, content_type)
        `)
        .eq("user_id", user?.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(5);

      const activity = [
        ...(transactionData || []).map(t => ({
          id: t.id,
          type: 'transaction',
          description: t.description,
          amount: t.amount,
          created_at: t.created_at,
          status: t.status
        })),
        ...(interactionData || []).map(i => ({
          id: i.id,
          type: 'interaction',
          description: `Interacted with ${i.content?.title || 'content'}`,
          interaction_type: i.interaction_type,
          created_at: i.created_at,
          rewarded: i.rewarded
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

      setUserContent(contentData || []);
      setUserTransactions(transactionData || []);
      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const metrics = [
    {
      title: "Total Coins Earned",
      value: profile?.coins?.toString() || "0",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Coins,
      iconColor: "success" as const,
    },
    {
      title: "Ads Created",
      value: userContent.length.toString(),
      change: `${userContent.filter(c => c.status === 'approved').length} approved`,
      changeType: "positive" as const,
      icon: Eye,
      iconColor: "primary" as const,
    },
    {
      title: "Total Earnings",
      value: `₦${profile?.total_earnings || 0}`,
      change: "Available for withdrawal",
      changeType: "neutral" as const,
      icon: Briefcase,
      iconColor: "accent" as const,
    },
    {
      title: "Transactions",
      value: userTransactions.length.toString(),
      change: "This month",
      changeType: "neutral" as const,
      icon: TrendingUp,
      iconColor: "secondary" as const,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your account and track your activity</p>
            </div>
            <div className="flex items-center gap-4">
              <CreateAdModal open={createAdOpen} onOpenChange={setCreateAdOpen} onSuccess={fetchUserData} />
              <Button onClick={() => setCreateAdOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Ad
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Ad Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Profile Section */}
                <Card className="lg:col-span-1 p-6 bg-gradient-card border-border/50">
                  <div className="text-center mb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>
                        {profile?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-foreground">
                      {profile?.full_name || "User"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      @{profile?.username || "username"}
                    </p>
                    <Badge className="mt-2 bg-success/20 text-success border-success/30">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{profile?.coins || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Coins</p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Metrics */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
                        <p className="text-muted-foreground">Track your activity and earnings</p>
                      </div>
                      <Select value={dateRange} onValueChange={(value) => {
                        setDateRange(value);
                        fetchUserData(parseInt(value));
                      }}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="30">Last 30 days</SelectItem>
                          <SelectItem value="90">Last 90 days</SelectItem>
                          <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {metrics.map((metric, index) => (
                        <MetricsCard key={index} {...metric} />
                      ))}
                    </div>
                  </div>

                  {/* Earnings Chart */}
                  <Card className="p-6 bg-gradient-card border-border/50 mb-6">
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-foreground">
                        Recent Account Activity
                      </h3>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {recentActivity.map((activity) => (
                          <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleDateString()} • 
                                <span className={`ml-1 ${
                                  activity.type === 'transaction' 
                                    ? activity.status === 'completed' ? 'text-success' : 'text-accent'
                                    : activity.rewarded ? 'text-success' : 'text-muted-foreground'
                                }`}>
                                  {activity.type === 'transaction' ? activity.status : (activity.rewarded ? 'rewarded' : 'no reward')}
                                </span>
                              </p>
                            </div>
                            {activity.type === 'transaction' && activity.amount && (
                              <div className={`text-sm font-bold ${
                                activity.amount > 0 ? "text-success" : "text-destructive"
                              }`}>
                                {activity.amount > 0 ? "+" : ""}{activity.amount}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <DashboardCalendar />
            </TabsContent>

            <TabsContent value="portfolio">
              <Portfolio />
            </TabsContent>

            <TabsContent value="settings">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="analytics">
              <AdvertiserAnalytics />
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  reward_coins: number;
  image_url?: string;
  created_at: string;
  location?: string;
  contact_info?: string;
}

const Feed = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(3);
  const [activeFilter, setActiveFilter] = useState("all");
  const [interactedItems, setInteractedItems] = useState<Set<string>>(new Set());
  const { user, loading: authLoading } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
  }, [user, authLoading, navigate]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .in("status", ["approved", "active"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(data || []);

      // update skeleton count based on expected results
      setSkeletonCount(data?.length && data.length > 0 ? data.length : 3);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const handleInteraction = async (contentId: string, rewardCoins: number) => {
    if (!user || interactedItems.has(contentId)) return;

    try {
      // Check if user already interacted with this content
      const { data: existingInteraction } = await supabase
        .from("user_interactions")
        .select("id")
        .eq("user_id", user.id)
        .eq("content_id", contentId)
        .eq("interaction_type", "click")
        .single();

      if (existingInteraction) {
        toast({
          title: "Already interacted",
          description: "You've already earned coins from this content.",
          variant: "destructive",
        });
        return;
      }

      // Create interaction record
      const { error: interactionError } = await supabase
        .from("user_interactions")
        .insert({
          user_id: user.id,
          content_id: contentId,
          interaction_type: "click",
          rewarded: true,
        });

      if (interactionError) throw interactionError;

      // Update user's coins
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          coins: (profile?.coins || 0) + rewardCoins,
          total_earnings: (profile?.total_earnings || 0) + rewardCoins
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_type: "earn",
        amount: rewardCoins,
        content_id: contentId,
        description: `Earned ${rewardCoins} coins from interaction`,
      });

      // Update local state
      setInteractedItems(prev => new Set([...prev, contentId]));
      refetchProfile();

      toast({
        title: "Coins earned!",
        description: `You earned ${rewardCoins} coins for this interaction.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredContent = content.filter(item => {
    if (activeFilter === "all") return true;
    return item.content_type === activeFilter;
  });

  const renderSkeletons = () => (
    <div className="space-y-6">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 0.15}s` }}
          className="animate-pulse"
        >
          <ContentCard loading />
        </div>
      ))}
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">{renderSkeletons()}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Discover Opportunities
            </h1>
            <p className="text-muted-foreground">
              Explore jobs, events, ads, and more. Earn coins for every interaction!
            </p>
          </div>

          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="job">Jobs</TabsTrigger>
              <TabsTrigger value="event">Events</TabsTrigger>
              <TabsTrigger value="ad">Ads</TabsTrigger>
              <TabsTrigger value="property">Property</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            renderSkeletons()
          ) : filteredContent.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card border-border/50">
              <p className="text-muted-foreground">
                {activeFilter === "all" 
                  ? "No opportunities available yet." 
                  : `No ${activeFilter} opportunities available.`
                }
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContent.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  type={item.content_type as "job" | "event" | "ad" | "property"}
                  coins={item.reward_coins}
                  image={item.image_url}
                  location={item.location}
                  contactInfo={item.contact_info}
                  onInteraction={() => handleInteraction(item.id, item.reward_coins)}
                  hasInteracted={interactedItems.has(item.id)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Keep scrolling to discover more opportunities...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feed;
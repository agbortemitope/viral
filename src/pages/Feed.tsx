import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import CreateAdModal from "@/components/CreateAdModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  reward_coins: number;
  image_url?: string;
  created_at: string;
}

const Feed = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Discover Opportunities
            </h1>
            <CreateAdModal onAdCreated={fetchContent} />
          </div>

          {content.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card border-border/50">
              <p className="text-muted-foreground">
                No opportunities available yet. Be the first to create one!
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {content.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  type={item.content_type as "job" | "event" | "ad" | "property"}
                  coins={item.reward_coins}
                  image={item.image_url}
                  onInteraction={() => {
                    // Handle user interaction and reward coins
                  }}
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

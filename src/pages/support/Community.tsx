import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Trophy, 
  Heart,
  MessageSquare,
  ThumbsUp,
  Share2
} from "lucide-react";

const Community = () => {
  const discussions = [
    {
      id: 1,
      title: "Best practices for creating engaging job ads",
      author: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      category: "Tips & Tricks",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
      isHot: true
    },
    {
      id: 2,
      title: "How I earned 10,000 coins in my first month",
      author: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      category: "Success Stories",
      replies: 67,
      likes: 128,
      timeAgo: "4 hours ago",
      isHot: true
    },
    {
      id: 3,
      title: "Feature request: Dark mode for the dashboard",
      author: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      category: "Feature Requests",
      replies: 15,
      likes: 32,
      timeAgo: "6 hours ago",
      isHot: false
    },
    {
      id: 4,
      title: "Community guidelines update - Please read",
      author: "Viral Team",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face",
      category: "Announcements",
      replies: 8,
      likes: 56,
      timeAgo: "1 day ago",
      isHot: false
    }
  ];

  const events = [
    {
      title: "Creator Meetup - Virtual",
      date: "Jan 25, 2024",
      time: "7:00 PM EST",
      attendees: 45
    },
    {
      title: "Q&A with Top Creators",
      date: "Feb 1, 2024",
      time: "6:00 PM EST",
      attendees: 23
    },
    {
      title: "Platform Updates Webinar",
      date: "Feb 8, 2024",
      time: "5:00 PM EST",
      attendees: 67
    }
  ];

  const topContributors = [
    {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      points: 2450,
      badge: "Expert"
    },
    {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      points: 1890,
      badge: "Helper"
    },
    {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      points: 1650,
      badge: "Contributor"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Community</h1>
            <p className="text-xl text-muted-foreground">
              Connect, share, and learn with fellow creators
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Community Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">2,847</div>
                    <div className="text-sm text-muted-foreground">Members</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-muted-foreground">Discussions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-bold">8,901</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Discussions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Discussions</CardTitle>
                    <Button>Start Discussion</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div key={discussion.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={discussion.avatar} />
                            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{discussion.title}</h3>
                              {discussion.isHot && (
                                <Badge variant="destructive" className="text-xs">Hot</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>by {discussion.author}</span>
                              <Badge variant="outline">{discussion.category}</Badge>
                              <span>{discussion.timeAgo}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {discussion.replies} replies
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {discussion.likes} likes
                              </div>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.map((event, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{contributor.name}</div>
                          <div className="text-sm text-muted-foreground">{contributor.points} points</div>
                        </div>
                        <Badge variant="secondary">{contributor.badge}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Be respectful and constructive</p>
                    <p>• No spam or self-promotion</p>
                    <p>• Stay on topic</p>
                    <p>• Help others when you can</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    Read Full Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
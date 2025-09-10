import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MessageCircle, Book, Video, Phone, Mail } from "lucide-react";

const HelpCenter = () => {
  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Viral",
      icon: Book,
      articles: 12,
      color: "bg-blue-500/20 text-blue-700"
    },
    {
      title: "Account & Profile",
      description: "Manage your account settings",
      icon: MessageCircle,
      articles: 8,
      color: "bg-green-500/20 text-green-700"
    },
    {
      title: "Earning Coins",
      description: "How to earn and use coins",
      icon: Video,
      articles: 15,
      color: "bg-purple-500/20 text-purple-700"
    },
    {
      title: "Creating Ads",
      description: "Guide to creating effective ads",
      icon: Phone,
      articles: 10,
      color: "bg-orange-500/20 text-orange-700"
    }
  ];

  const popularArticles = [
    "How to create your first ad",
    "Understanding the coin system",
    "Setting up your profile",
    "Payment and withdrawal guide",
    "Community guidelines",
    "Troubleshooting common issues"
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Find answers to your questions and get the help you need
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-card transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
              <CardDescription>
                Most frequently accessed help articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <span className="text-foreground">{article}</span>
                    <Button variant="ghost" size="sm">
                      Read
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Get in touch with our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
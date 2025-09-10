import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Settings, BarChart3, Target, Shield, Info } from "lucide-react";
import { useState } from "react";

const CookiePolicy = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true
  });

  const cookieTypes = [
    {
      icon: Shield,
      title: "Necessary Cookies",
      description: "Essential for the website to function properly",
      required: true,
      examples: [
        "Authentication and login status",
        "Shopping cart contents",
        "Security and fraud prevention",
        "Basic website functionality"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      required: false,
      examples: [
        "Page views and user behavior",
        "Traffic sources and referrals",
        "Performance metrics",
        "Error tracking and debugging"
      ]
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      description: "Used to deliver personalized advertisements",
      required: false,
      examples: [
        "Targeted advertising",
        "Social media integration",
        "Cross-site tracking",
        "Conversion tracking"
      ]
    },
    {
      icon: Settings,
      title: "Preference Cookies",
      description: "Remember your settings and preferences",
      required: false,
      examples: [
        "Language preferences",
        "Theme settings (dark/light mode)",
        "Layout customizations",
        "Notification preferences"
      ]
    }
  ];

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage and update cookie consent
    localStorage.setItem('cookieConsent', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Cookie className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 15, 2024
            </p>
            <p className="text-muted-foreground mt-2">
              Learn about how we use cookies and similar technologies on our platform.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                keeping you logged in, and helping us understand how you use our platform. We use both 
                first-party cookies (set by us) and third-party cookies (set by our partners) to enhance 
                your experience and provide our services.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Types and Settings */}
          <div className="space-y-6">
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              const settingKey = type.title.toLowerCase().split(' ')[0] as keyof typeof cookieSettings;
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{type.title}</CardTitle>
                          <CardDescription>{type.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {type.required ? (
                          <span className="text-sm text-muted-foreground">Required</span>
                        ) : (
                          <Switch
                            checked={cookieSettings[settingKey]}
                            onCheckedChange={(checked) =>
                              setCookieSettings({ ...cookieSettings, [settingKey]: checked })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cookie Management */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
              <CardDescription>
                You can control your cookie settings here or through your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Button onClick={handleSaveSettings} className="px-8">
                    Save Cookie Preferences
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You can also manage cookies through your browser settings. Note that disabling 
                    certain cookies may affect the functionality of our website.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Third-Party Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We work with trusted third-party services that may set their own cookies:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Analytics</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Google Analytics</li>
                    <li>• Mixpanel</li>
                    <li>• Hotjar</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Advertising</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Google Ads</li>
                    <li>• Facebook Pixel</li>
                    <li>• Twitter Analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Questions About Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@viral.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@viral.com</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                If you have any questions about our use of cookies or this Cookie Policy, 
                please don't hesitate to contact us.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
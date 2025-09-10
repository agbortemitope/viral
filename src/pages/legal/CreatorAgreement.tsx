import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PenTool, DollarSign, Target, Award, AlertCircle, Handshake } from "lucide-react";

const CreatorAgreement = () => {
  const sections = [
    {
      icon: PenTool,
      title: "Creator Responsibilities",
      content: [
        "Create original, high-quality content that complies with our community guidelines",
        "Ensure all content is truthful, accurate, and not misleading",
        "Respect intellectual property rights and obtain necessary permissions",
        "Maintain professional standards in all interactions with users and brands",
        "Respond to comments and messages in a timely and respectful manner"
      ]
    },
    {
      icon: DollarSign,
      title: "Compensation and Payments",
      content: [
        "Earn coins based on user engagement and interaction with your content",
        "Payment rates may vary based on content type, quality, and performance",
        "Minimum withdrawal threshold of 1,000 coins (approximately $10 USD)",
        "Payments processed within 5-7 business days after withdrawal request",
        "Tax reporting requirements may apply based on your jurisdiction"
      ]
    },
    {
      icon: Target,
      title: "Content Guidelines and Standards",
      content: [
        "All content must be appropriate for a general audience",
        "No content promoting illegal activities, hate speech, or discrimination",
        "Advertising content must be clearly labeled and comply with FTC guidelines",
        "Respect user privacy and do not collect personal information without consent",
        "Follow platform-specific formatting and quality requirements"
      ]
    },
    {
      icon: Award,
      title: "Performance Metrics and Rewards",
      content: [
        "Earnings based on views, clicks, applications, and user engagement",
        "Bonus rewards for high-performing content and consistent quality",
        "Monthly performance reviews and feedback from our team",
        "Opportunity to participate in featured creator programs",
        "Access to analytics and insights to improve content performance"
      ]
    },
    {
      icon: AlertCircle,
      title: "Violations and Enforcement",
      content: [
        "Warning system for minor violations of community guidelines",
        "Temporary suspension for repeated or serious violations",
        "Permanent account termination for severe breaches of this agreement",
        "Right to appeal enforcement actions through our review process",
        "Forfeiture of unpaid earnings in cases of fraudulent activity"
      ]
    },
    {
      icon: Handshake,
      title: "Partnership Terms",
      content: [
        "This agreement establishes an independent contractor relationship",
        "No exclusive partnership - you may work with other platforms",
        "We reserve the right to feature your content in marketing materials",
        "Confidentiality requirements for any proprietary information shared",
        "Either party may terminate this agreement with 30 days written notice"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <PenTool className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Creator Agreement</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 15, 2024
            </p>
            <p className="text-muted-foreground mt-2">
              Terms and conditions for content creators on the Viral platform.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome to the Creator Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This Creator Agreement ("Agreement") governs your participation in the Viral Creator Program. 
                By creating content on our platform, you agree to these terms and conditions. This agreement 
                is designed to ensure a fair, transparent, and mutually beneficial relationship between creators 
                and our platform while maintaining high standards for content quality and user experience.
              </p>
            </CardContent>
          </Card>

          {/* Agreement Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Creator Benefits */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Creator Benefits</CardTitle>
              <CardDescription>
                What you get as a Viral creator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Earning Opportunities</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Competitive coin rates</li>
                    <li>• Performance bonuses</li>
                    <li>• Featured creator opportunities</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Support & Resources</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Dedicated creator support</li>
                    <li>• Analytics and insights</li>
                    <li>• Creator community access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Creator Support</CardTitle>
              <CardDescription>
                Questions about the Creator Agreement or program?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Creator Support:</strong> creators@viral.com</p>
                <p><strong>Partnership Inquiries:</strong> partnerships@viral.com</p>
                <p><strong>Legal Questions:</strong> legal@viral.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance Notice */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                By creating content on Viral, you acknowledge that you have read, understood, and agree to be 
                bound by this Creator Agreement. This agreement may be updated from time to time, and continued 
                participation in the Creator Program constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatorAgreement;
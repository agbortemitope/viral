import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: Users,
      title: "User Accounts and Responsibilities",
      content: [
        "You must be at least 18 years old to create an account",
        "You are responsible for maintaining the security of your account credentials",
        "You must provide accurate and complete information when creating your account",
        "You are responsible for all activities that occur under your account",
        "You must notify us immediately of any unauthorized use of your account"
      ]
    },
    {
      icon: Shield,
      title: "Acceptable Use Policy",
      content: [
        "Use our platform only for lawful purposes and in accordance with these Terms",
        "Do not upload, post, or transmit any content that is illegal, harmful, or offensive",
        "Do not attempt to gain unauthorized access to our systems or other users' accounts",
        "Do not use our platform to spam, harass, or abuse other users",
        "Do not engage in any activity that could damage or impair our platform"
      ]
    },
    {
      icon: FileText,
      title: "Content and Intellectual Property",
      content: [
        "You retain ownership of content you create and upload to our platform",
        "By uploading content, you grant us a license to use, display, and distribute it",
        "You represent that you have the right to upload and share your content",
        "We respect intellectual property rights and will respond to valid DMCA notices",
        "Our platform and its original content are protected by copyright and other laws"
      ]
    },
    {
      icon: Scale,
      title: "Payment Terms and Coins",
      content: [
        "Coins are virtual currency used within our platform for transactions",
        "Coin purchases are final and non-refundable except as required by law",
        "We reserve the right to modify coin values and exchange rates with notice",
        "Unused coins may expire after a period of account inactivity",
        "We may suspend or terminate accounts for fraudulent payment activity"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Disclaimers and Limitations",
      content: [
        "Our platform is provided 'as is' without warranties of any kind",
        "We do not guarantee uninterrupted or error-free service",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid us in the past 12 months",
        "Some jurisdictions do not allow certain limitations, so these may not apply to you"
      ]
    },
    {
      icon: Gavel,
      title: "Termination and Enforcement",
      content: [
        "We may suspend or terminate your account for violations of these Terms",
        "You may terminate your account at any time through your account settings",
        "Upon termination, your right to use our platform ceases immediately",
        "We may retain certain information as required by law or for legitimate business purposes",
        "These Terms are governed by the laws of California, United States"
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
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 15, 2024
            </p>
            <p className="text-muted-foreground mt-2">
              Please read these Terms of Service carefully before using our platform.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Viral ("we," "our," or "us"), you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service. These Terms of Service govern your use of our platform, including any 
                content, functionality, and services offered on or through our website and mobile applications.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
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

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Questions About These Terms</CardTitle>
              <CardDescription>
                If you have any questions about these Terms of Service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@viral.com</p>
                <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          {/* Updates Notice */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                We reserve the right to modify these Terms of Service at any time. We will notify users of 
                any material changes by posting the updated terms on our platform and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
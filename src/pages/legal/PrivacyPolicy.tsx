import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, profile information)",
        "Usage data and analytics about how you interact with our platform",
        "Device information including IP address, browser type, and operating system",
        "Cookies and similar tracking technologies for improving user experience",
        "Content you create, upload, or share on our platform"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To process transactions and manage your account",
        "To communicate with you about updates, security alerts, and support",
        "To improve our platform and develop new features",
        "To comply with legal obligations and protect against fraud"
      ]
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We may share data with service providers who help us operate our platform",
        "We may disclose information when required by law or to protect our rights",
        "Anonymous, aggregated data may be shared for research and analytics",
        "You control what information is visible in your public profile"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We use industry-standard encryption to protect your data",
        "Regular security audits and monitoring systems",
        "Secure data centers with physical and digital access controls",
        "Employee training on data protection and privacy practices",
        "Incident response procedures for potential security breaches"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and download your personal data",
        "Correct or update your information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Data portability to other services"
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
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 15, 2024
            </p>
            <p className="text-muted-foreground mt-2">
              We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your information.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Commitment to Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At Viral, we believe privacy is a fundamental right. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform. We are committed to 
                maintaining the trust and confidence of our users by ensuring your personal information is 
                handled responsibly and in accordance with applicable privacy laws.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Sections */}
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
              <CardTitle>Contact Us About Privacy</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy or our data practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@viral.com</p>
                <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
                <p><strong>Data Protection Officer:</strong> dpo@viral.com</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We will respond to privacy-related inquiries within 30 days of receipt.
              </p>
            </CardContent>
          </Card>

          {/* Updates Notice */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
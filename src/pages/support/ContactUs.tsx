import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
      setLoading(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "support@viral.com",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team",
      value: "Available 9 AM - 6 PM EST",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us directly",
      value: "+1 (555) 123-4567",
      action: "Call Now"
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: "Address",
      value: "123 Innovation Drive\nSan Francisco, CA 94105"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Monday - Friday: 9 AM - 6 PM EST\nWeekends: 10 AM - 4 PM EST"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help. Get in touch with our support team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief description of your inquiry"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide as much detail as possible..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Choose your preferred way to contact us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{method.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                          <p className="text-sm font-medium">{method.value}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            {method.action}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Office Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Office Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officeInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-secondary/20 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{info.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View FAQ
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

export default ContactUs;
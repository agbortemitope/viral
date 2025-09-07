import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mail, Lock, User, MapPin, Phone } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              OpportunityHub
            </h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Join the Future of{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Earning
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Connect with opportunities, earn coins, and build your portfolio in our thriving community.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-success/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <span className="text-foreground">Earn coins for every interaction</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span className="text-foreground">Build your professional portfolio</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <span className="text-foreground">Connect with top brands and employers</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <Badge className="bg-success/20 text-success border-success/30">
                2.5K+ Active Users
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                ₦4.2M+ Earned
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <Card className="p-8 bg-gradient-card border-border/50 shadow-card">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h3>
              <p className="text-muted-foreground">Start earning coins today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>

              {/* Phone and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 800 000 0000"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Lagos, Nigeria"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeToTerms", checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeToMarketing", checked as boolean)}
                  />
                  <label htmlFor="marketing" className="text-sm text-muted-foreground">
                    Send me updates about new opportunities and features
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={!formData.agreeToTerms}
              >
                Create Account & Start Earning
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/signin" className="text-primary hover:underline font-medium">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
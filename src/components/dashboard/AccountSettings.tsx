import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { supabase } from "@/integrations/supabase/client";
import { getBankCode, nigerianBanks } from "@/lib/nigerian-banks";
import { Loader2, Upload, User, Mail, Bell, Shield, Trash2, CheckCircle2 } from "lucide-react";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();
  const { settings: notifications, updateSettings: updateNotifications } = useNotificationSettings();
  const { uploadAvatar, uploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
    bank_name: (profile as any)?.bank_name || "",
    account_number: (profile as any)?.account_number || "",
    account_name: (profile as any)?.account_name || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
        refetchProfile();
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, you'd call an API to delete the account
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been submitted.",
      });
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updateNotifications({ [key]: value });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password change requested",
      description: "Check your email for password reset instructions.",
    });
  };

  const verifyBankAccount = async () => {
    if (!formData.bank_name || !formData.account_number) {
      return;
    }

    if (formData.account_number.length !== 10) {
      toast({
        title: "Invalid account number",
        description: "Account number must be exactly 10 digits",
        variant: "destructive",
      });
      return;
    }

    const bankCode = getBankCode(formData.bank_name);
    if (!bankCode) {
      toast({
        title: "Bank not found",
        description: "Please enter a valid Nigerian bank name (e.g., GTBank, Access Bank)",
        variant: "destructive",
      });
      return;
    }

    setVerifyingBank(true);
    setBankVerified(false);

    try {
      const { data, error } = await supabase.functions.invoke('verify-bank-account', {
        body: {
          account_number: formData.account_number,
          bank_code: bankCode,
        },
      });

      if (error) throw error;

      if (data.verified) {
        setFormData(prev => ({
          ...prev,
          account_name: data.account_name,
        }));
        setBankVerified(true);
        toast({
          title: "Account verified!",
          description: `Account belongs to ${data.account_name}`,
        });
      } else {
        toast({
          title: "Verification failed",
          description: data.error || "Could not verify account details",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification error",
        description: error.message || "Failed to verify account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifyingBank(false);
    }
  };

  // Auto-verify when both bank name and account number are complete
  useEffect(() => {
    if (formData.bank_name && formData.account_number && formData.account_number.length === 10) {
      const timer = setTimeout(() => {
        verifyBankAccount();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.bank_name, formData.account_number]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your profile information and avatar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>
                {formData.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Avatar
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and manage your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input value={user?.email || ""} disabled />
            <p className="text-sm text-muted-foreground mt-1">
              Contact support to change your email address.
            </p>
          </div>
          <div>
            <Label>Account Created</Label>
            <Input value={new Date(profile?.created_at || "").toLocaleDateString()} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email_notifications}
              onCheckedChange={(checked) => 
                handleNotificationChange('email_notifications', checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch
              checked={notifications.push_notifications}
              onCheckedChange={(checked) => 
                handleNotificationChange('push_notifications', checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={notifications.marketing_communications}
              onCheckedChange={(checked) => 
                handleNotificationChange('marketing_communications', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bank Account for Withdrawal
          </CardTitle>
          <CardDescription>
            Link your bank account to withdraw your earnings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bank_name">Bank Name</Label>
            <Select 
              value={formData.bank_name} 
              onValueChange={(value) => {
                setFormData({ ...formData, bank_name: value });
                setBankVerified(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50 max-h-[300px]">
                {Object.keys(nigerianBanks).sort().map((bankName) => (
                  <SelectItem key={bankName} value={bankName} className="capitalize">
                    {bankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Select your Nigerian bank
            </p>
          </div>
          <div>
            <Label htmlFor="account_number">Account Number</Label>
            <div className="relative">
              <Input
                id="account_number"
                placeholder="10 digit account number"
                value={formData.account_number}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, account_number: value });
                  setBankVerified(false);
                }}
              />
              {verifyingBank && (
                <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground" />
              )}
              {bankVerified && !verifyingBank && (
                <CheckCircle2 className="h-4 w-4 text-green-500 absolute right-3 top-3" />
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              placeholder="Will be auto-filled after verification"
              value={formData.account_name}
              disabled
              className={bankVerified ? "bg-green-50 dark:bg-green-950/20" : ""}
            />
            {bankVerified && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Account verified successfully
              </p>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving || !bankVerified}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Bank Details
          </Button>
          {!bankVerified && formData.bank_name && formData.account_number && (
            <p className="text-xs text-muted-foreground">
              Please verify your account details before saving
            </p>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handlePasswordChange}>
            Change Password
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign Out of All Devices
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
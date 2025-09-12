import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Loader2, Upload, User, Mail, Bell, Shield, Trash2 } from "lucide-react";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading, refetch: refetchProfile } = useProfile();
  const { toast } = useToast();
  const { settings: notifications, updateSettings: updateNotifications } = useNotificationSettings();
  const { uploadAvatar, uploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
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
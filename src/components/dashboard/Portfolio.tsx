import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Briefcase, 
  Eye, 
  ExternalLink,
  User,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Loader2,
  Upload,
  FileText,
  Copy,
  Share2
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  category: string;
  tags: string[];
  created_at: string;
}

const categories = [
  "Design",
  "Web Development", 
  "Video Editing",
  "Content Creation",
  "Marketing",
  "Photography",
  "Writing",
  "Animation"
];

const Portfolio = () => {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { documents, uploading, uploadDocument, deleteDocument } = useDocuments();
  const { toast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  
  const [profileData, setProfileData] = useState<{
    portfolio_title: string;
    portfolio_description: string;
    skills: string[];
    categories: string[];
    hourly_rate: number;
    available: boolean;
    marketplace_enabled: boolean;
  }>({
    portfolio_title: profile?.portfolio_title || "",
    portfolio_description: profile?.portfolio_description || "",
    skills: profile?.skills || [],
    categories: profile?.categories || [],
    hourly_rate: profile?.hourly_rate || 0,
    available: profile?.available ?? true,
    marketplace_enabled: (profile as any)?.marketplace_enabled ?? false,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    category: "",
    tags: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        portfolio_title: profile.portfolio_title || "",
        portfolio_description: profile.portfolio_description || "",
        skills: profile.skills || [],
        categories: profile.categories || [],
        hourly_rate: profile.hourly_rate || 0,
        available: profile.available || true,
        marketplace_enabled: (profile as any)?.marketplace_enabled ?? false,
      });
      setMarketplaceEnabled((profile as any)?.marketplace_enabled || false);
      setPortfolioLink((profile as any)?.portfolio_link || `${window.location.origin}/portfolio/${profile.username || profile.user_id}`);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchPortfolioItems();
    }
  }, [user]);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching portfolio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Generate portfolio link if not exists
      const link = portfolioLink || `${window.location.origin}/portfolio/${profile?.username || profile?.user_id}`;
      
      const { error } = await updateProfile({
        ...profileData,
        marketplace_enabled: marketplaceEnabled,
        portfolio_link: link,
      });
      if (error) throw error;
      
      setPortfolioLink(link);
      
      toast({
        title: "Portfolio updated",
        description: "Your portfolio profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating portfolio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioLink);
    toast({
      title: "Link copied!",
      description: "Portfolio link copied to clipboard",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadDocument(file, 'cv');
  };

  const cvDocuments = documents.filter(d => d.document_type === 'cv');

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(itemForm)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert({ ...itemForm, user_id: user?.id });
        if (error) throw error;
      }
      
      await fetchPortfolioItems();
      setShowAddForm(false);
      setEditingItem(null);
      setItemForm({ title: "", description: "", image_url: "", project_url: "", category: "", tags: [] });
      
      toast({
        title: editingItem ? "Item updated" : "Item added",
        description: `Portfolio item has been successfully ${editingItem ? 'updated' : 'added'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error saving item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchPortfolioItems();
      toast({
        title: "Item deleted",
        description: "Portfolio item has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      project_url: item.project_url,
      category: item.category,
      tags: item.tags
    });
    setShowAddForm(true);
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !itemForm.tags.includes(tag)) {
      setItemForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setItemForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Portfolio Profile
          </CardTitle>
          <CardDescription>
            Showcase your skills and experience to potential clients on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio_title">Portfolio Title</Label>
              <Input
                id="portfolio_title"
                value={profileData.portfolio_title}
                onChange={(e) => setProfileData(prev => ({ ...prev, portfolio_title: e.target.value }))}
                placeholder="e.g., Creative Designer & Web Developer"
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (₦)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={profileData.hourly_rate}
                onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="portfolio_description">Portfolio Description</Label>
            <Textarea
              id="portfolio_description"
              value={profileData.portfolio_description}
              onChange={(e) => setProfileData(prev => ({ ...prev, portfolio_description: e.target.value }))}
              placeholder="Describe your expertise and what you can offer to clients..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Categories</Label>
            <Select 
              onValueChange={(value) => {
                if (!profileData.categories.includes(value)) {
                  setProfileData(prev => ({ ...prev, categories: [...prev.categories, value] }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileData.categories.map(cat => (
                <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                  {cat}
                  <button onClick={() => setProfileData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addSkill(input.value);
                  input.value = '';
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileData.skills.map(skill => (
                <Badge key={skill} variant="outline" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)}>×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Available for Work
              </Label>
              <p className="text-sm text-muted-foreground">
                Show that you're currently accepting new projects
              </p>
            </div>
            <Switch
              checked={profileData.available}
              onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, available: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Host on Marketplace
              </Label>
              <p className="text-sm text-muted-foreground">
                Make your portfolio visible on the marketplace
              </p>
            </div>
            <Switch
              checked={marketplaceEnabled}
              onCheckedChange={setMarketplaceEnabled}
            />
          </div>

          {portfolioLink && (
            <div>
              <Label>Shareable Portfolio Link</Label>
              <div className="flex gap-2 mt-2">
                <Input value={portfolioLink} readOnly />
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Portfolio Profile
          </Button>
        </CardContent>
      </Card>

      {/* CV Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV / Resume
          </CardTitle>
          <CardDescription>
            Upload your CV or resume to share with potential clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cv-upload">Upload CV</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Accepted formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {cvDocuments.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded CVs</Label>
              {cvDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {doc.is_primary && (
                      <Badge variant="secondary">Primary</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Portfolio Items
              </CardTitle>
              <CardDescription>
                Showcase your best work to attract potential clients.
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingItem ? "Edit" : "Add"} Portfolio Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item_title">Title</Label>
                    <Input
                      id="item_title"
                      value={itemForm.title}
                      onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item_category">Category</Label>
                    <Select 
                      value={itemForm.category}
                      onValueChange={(value) => setItemForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="item_description">Description</Label>
                  <Textarea
                    id="item_description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this project..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item_image">Image URL</Label>
                    <Input
                      id="item_image"
                      value={itemForm.image_url}
                      onChange={(e) => setItemForm(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item_url">Project URL</Label>
                    <Input
                      id="item_url"
                      value={itemForm.project_url}
                      onChange={(e) => setItemForm(prev => ({ ...prev, project_url: e.target.value }))}
                      placeholder="https://example.com/project"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addTag(input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {itemForm.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button onClick={() => removeTag(tag)}>×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveItem} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {editingItem ? "Update" : "Add"} Item
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setItemForm({ title: "", description: "", image_url: "", project_url: "", category: "", tags: [] });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {portfolioItems.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No portfolio items yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first project to showcase your work
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-0">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          {item.project_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
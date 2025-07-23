import { useState } from "react";
import { Heart, Copy, Trash2, FileText, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for liked ideas
const mockLikedIdeas = [{
  id: 1,
  title: "Summer Fashion Trends",
  content: "Discover the hottest summer fashion trends that will make you stand out. From vibrant colors to sustainable fabrics...",
  platform: "Instagram",
  createdAt: "2024-01-15",
  tags: ["fashion", "summer", "trends"]
}, {
  id: 2,
  title: "Professional LinkedIn Post",
  content: "How to write compelling LinkedIn posts that engage your professional network and drive meaningful conversations...",
  platform: "LinkedIn",
  createdAt: "2024-01-14",
  tags: ["professional", "networking", "content"]
}, {
  id: 3,
  title: "Brand Storytelling Ideas",
  content: "Transform your brand narrative with these powerful storytelling techniques that resonate with your audience...",
  platform: "Instagram",
  createdAt: "2024-01-13",
  tags: ["storytelling", "branding", "engagement"]
}];
export function Library() {
  const [likedIdeas, setLikedIdeas] = useState(mockLikedIdeas);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateFormData, setGenerateFormData] = useState({
    brandName: "",
    niche: "",
    competitorsSocialLinks: "",
    platforms: "",
    competitorsPlatformLinks: "",
  });
  const {
    toast
  } = useToast();
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard."
    });
  };
  const handleRemove = (id: number) => {
    setLikedIdeas(prev => prev.filter(idea => idea.id !== id));
    toast({
      title: "Idea removed",
      description: "The idea has been removed from your library."
    });
  };
  const handleScriptIt = (idea: any) => {
    // TODO: Implement script it functionality
    toast({
      title: "Script it",
      description: `Creating script for: ${idea.title}`
    });
    console.log("Scripting idea:", idea.title);
  };
  const handleEdit = (idea: any) => {
    setEditingIdea({
      ...idea,
      tags: idea.tags.join(', ')
    }); // Convert tags array to string for editing
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    if (!editingIdea) return;
    const updatedIdea = {
      ...editingIdea,
      tags: editingIdea.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    };
    setLikedIdeas(prev => prev.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
    setIsEditDialogOpen(false);
    setEditingIdea(null);
    toast({
      title: "Idea updated",
      description: "Your idea has been successfully updated."
    });
  };
  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingIdea(null);
  };

  const handleGenerateIdeas = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generating content with:", generateFormData);
    toast({
      title: "Generating ideas",
      description: "Content ideas are being generated based on your inputs."
    });
    setIsGenerateDialogOpen(false);
    // TODO: Implement content generation logic
  };

  const handlePlatformChange = (value: string) => {
    setGenerateFormData(prev => ({
      ...prev,
      platforms: value
    }));
  };
  return <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">The Library of Ideas</h1>
            <p className="text-muted-foreground">
              Your collection of liked content ideas, ready to use whenever you need inspiration.
            </p>
          </div>
          <Button 
            onClick={() => setIsGenerateDialogOpen(true)}
            className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Ideas
          </Button>
        </div>
      </div>

      {likedIdeas.length === 0 ? <Card className="bg-card border-border text-center py-12 shadow-butter-glow">
          <CardContent>
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle className="font-serif mb-2">No Liked Ideas Yet</CardTitle>
            <CardDescription>
              Start generating content and like your favorite ideas to see them here.
            </CardDescription>
          </CardContent>
        </Card> : <div className="grid gap-6">
          {likedIdeas.map(idea => <Card key={idea.id} className="bg-card border-border shadow-butter-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-sans font-bold text-xl mb-2">{idea.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{idea.platform}</Badge>
                      <span className="text-sm text-muted-foreground">{idea.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 fill-current" style={{
                color: 'hsl(var(--butter-yellow))'
              }} />
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(idea.id)} className="h-8 w-8 p-0 hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{idea.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {idea.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(idea.content)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(idea)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => handleScriptIt(idea)} className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90">
                      <FileText className="h-4 w-4 mr-1" />
                      Script it
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-butter-glow">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Idea</DialogTitle>
            <DialogDescription>
              Make changes to your content idea. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {editingIdea && <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editingIdea.title} onChange={e => setEditingIdea(prev => ({
              ...prev,
              title: e.target.value
            }))} className="col-span-3" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Description</Label>
                <Textarea id="edit-content" value={editingIdea.content} onChange={e => setEditingIdea(prev => ({
              ...prev,
              content: e.target.value
            }))} className="col-span-3 min-h-[120px]" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input id="edit-tags" value={editingIdea.tags} onChange={e => setEditingIdea(prev => ({
              ...prev,
              tags: e.target.value
            }))} placeholder="fashion, summer, trends" className="col-span-3" />
              </div>
            </div>}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Ideas Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-card border-border shadow-butter-glow">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Generate Content Ideas</DialogTitle>
            <DialogDescription>
              Fill in the details below to generate personalized content ideas.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleGenerateIdeas} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                placeholder="Enter your brand name"
                value={generateFormData.brandName}
                onChange={(e) => setGenerateFormData(prev => ({ ...prev, brandName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., Fashion, Technology, Food & Beverage"
                value={generateFormData.niche}
                onChange={(e) => setGenerateFormData(prev => ({ ...prev, niche: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorsSocialLinks">Competitors' Social Links</Label>
              <Textarea
                id="competitorsSocialLinks"
                placeholder="Enter competitor social media links (one per line)"
                value={generateFormData.competitorsSocialLinks}
                onChange={(e) => setGenerateFormData(prev => ({ ...prev, competitorsSocialLinks: e.target.value }))}
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Platforms to Target</Label>
              <Select value={generateFormData.platforms} onValueChange={handlePlatformChange}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select platform(s)" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorsPlatformLinks">Competitor's Platform Links</Label>
              <Textarea
                id="competitorsPlatformLinks"
                placeholder="Enter specific competitor platform links"
                value={generateFormData.competitorsPlatformLinks}
                onChange={(e) => setGenerateFormData(prev => ({ ...prev, competitorsPlatformLinks: e.target.value }))}
                className="min-h-[60px]"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
              >
                Generate Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
}
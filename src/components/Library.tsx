import { useState } from "react";
import { Heart, Plus, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ItemCard } from "@/components/common/ItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useContentIdeas } from "@/hooks/useContentIdeas";
export function Library() {
  const { ideas, loading, updateIdea, removeIdea } = useContentIdeas();
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
  const { toast } = useToast();
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard", description: "Content has been copied to your clipboard." });
  };

  const handleRemove = (id: string) => {
    removeIdea(id);
  };

  const handleScriptIt = (idea: any) => {
    toast({ title: "Script it", description: `Creating script for: ${idea.title}` });
    console.log("Scripting idea:", idea.title);
  };

  const handleEdit = (idea: any) => {
    setEditingIdea({ ...idea, tags: idea.tags.join(', ') });
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    if (!editingIdea) return;
    const updates = {
      title: editingIdea.title,
      content: editingIdea.content,
      platform: editingIdea.platform,
      tags: editingIdea.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    };
    updateIdea(editingIdea.id, updates);
    setIsEditDialogOpen(false);
    setEditingIdea(null);
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : ideas.length === 0 ? (
        <EmptyState 
          icon={Heart}
          title="No Liked Ideas Yet"
          description="Start generating content and like your favorite ideas to see them here."
        />
      ) : (
        <div className="grid gap-6">
          {ideas.map(idea => (
            <ItemCard
              key={idea.id}
              item={idea}
              onCopy={handleCopy}
              onEdit={handleEdit}
              onRemove={handleRemove}
              primaryAction={{
                label: "Script it",
                icon: FileText,
                onClick: handleScriptIt
              }}
            />
          ))}
        </div>
      )}

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
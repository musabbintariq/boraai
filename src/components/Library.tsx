import { useState } from "react";
import { Heart, Plus, FileText, Loader2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ItemCard } from "@/components/common/ItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { IdeaFeedback } from "@/components/IdeaFeedback";
import { useContentIdeas } from "@/hooks/useContentIdeas";
import { useGeneratedIdeas } from "@/hooks/useGeneratedIdeas";

interface LibraryProps {
  selectedBrandId?: string | null;
}

export function Library({ selectedBrandId }: LibraryProps) {
  const { ideas, loading, updateIdea, removeIdea } = useContentIdeas(selectedBrandId);
  const { saveGeneratedIdea, pendingIdeas } = useGeneratedIdeas();
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

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock generation - in real app this would call an AI service
    const mockIdeas = [
      {
        title: "Behind the Scenes Content",
        content: `Show your audience what goes on behind the scenes of your ${generateFormData.niche.toLowerCase()} business. People love authentic content that gives them a peek into your process.`,
        platform: generateFormData.platforms,
        tags: ["behind-the-scenes", "authentic", "process"],
        generation_context: { ...generateFormData, timestamp: new Date().toISOString() }
      },
      {
        title: "Industry Tips & Tricks",
        content: `Share valuable tips and tricks specific to the ${generateFormData.niche.toLowerCase()} industry. Position yourself as an expert while providing genuine value to your audience.`,
        platform: generateFormData.platforms,
        tags: ["tips", "expert", "value"],
        generation_context: { ...generateFormData, timestamp: new Date().toISOString() }
      },
      {
        title: "Customer Success Story",
        content: `Feature a customer success story showing how your ${generateFormData.brandName} products or services made a difference. Social proof is powerful content.`,
        platform: generateFormData.platforms,
        tags: ["testimonial", "success-story", "social-proof"],
        generation_context: { ...generateFormData, timestamp: new Date().toISOString() }
      }
    ];

    // Save generated ideas to the database
    for (const idea of mockIdeas) {
      await saveGeneratedIdea({
        ...idea,
        brand_id: selectedBrandId || undefined
      });
    }

    toast({
      title: "Ideas generated!",
      description: `${mockIdeas.length} content ideas are ready for your review.`
    });
    
    setIsGenerateDialogOpen(false);
  };

  const handlePlatformChange = (value: string) => {
    setGenerateFormData(prev => ({
      ...prev,
      platforms: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">The Library of Ideas</h1>
            <p className="text-muted-foreground">
              {selectedBrandId 
                ? "Your collection of content ideas for the selected brand, ready to use whenever you need inspiration."
                : "Your collection of content ideas, ready to use whenever you need inspiration. Select a brand to filter ideas."
              }
            </p>
          </div>
          {selectedBrandId && (
            <Button 
              onClick={() => setIsGenerateDialogOpen(true)}
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Ideas
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Saved Ideas ({ideas.length})
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Review Ideas ({pendingIdeas.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : ideas.length === 0 && selectedBrandId ? (
            <EmptyState 
              icon={Heart}
              title="No Ideas for This Brand Yet"
              description="Generate content ideas for this brand to see them here."
            />
          ) : ideas.length === 0 ? (
            <EmptyState 
              icon={Heart}
              title="No Ideas Yet"
              description="Select a brand and start generating content ideas to see them here."
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
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <IdeaFeedback onComplete={() => {
            toast({
              title: "All done!",
              description: "You've reviewed all pending ideas."
            });
          }} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-butter-glow">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Idea</DialogTitle>
            <DialogDescription>
              Make changes to your content idea. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {editingIdea && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={editingIdea.title} 
                  onChange={e => setEditingIdea(prev => ({
                    ...prev,
                    title: e.target.value
                  }))} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Description</Label>
                <Textarea 
                  id="edit-content" 
                  value={editingIdea.content} 
                  onChange={e => setEditingIdea(prev => ({
                    ...prev,
                    content: e.target.value
                  }))} 
                  className="col-span-3 min-h-[120px]" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input 
                  id="edit-tags" 
                  value={editingIdea.tags} 
                  onChange={e => setEditingIdea(prev => ({
                    ...prev,
                    tags: e.target.value
                  }))} 
                  placeholder="fashion, summer, trends" 
                  className="col-span-3" 
                />
              </div>
            </div>
          )}
          
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
    </div>
  );
}
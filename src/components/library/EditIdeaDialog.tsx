import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ContentIdea } from "@/hooks/optimized/useContentIdeasOptimized";

interface EditIdeaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  idea: ContentIdea | null;
  onSave: (id: string, updates: any) => void;
}

export const EditIdeaDialog = ({ 
  isOpen, 
  onOpenChange, 
  idea, 
  onSave 
}: EditIdeaDialogProps) => {
  const [editingIdea, setEditingIdea] = useState<any>(null);

  const handleOpen = (open: boolean) => {
    if (open && idea) {
      setEditingIdea({ 
        ...idea, 
        tags: idea.tags.join(', ') 
      });
    } else if (!open) {
      setEditingIdea(null);
    }
    onOpenChange(open);
  };

  const handleSave = () => {
    if (!editingIdea) return;
    
    const updates = {
      title: editingIdea.title,
      content: editingIdea.content,
      platform: editingIdea.platform,
      tags: editingIdea.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    };
    
    onSave(editingIdea.id, updates);
    handleOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
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
          <Button variant="outline" onClick={() => handleOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
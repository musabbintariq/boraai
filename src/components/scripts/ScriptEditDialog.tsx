import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Script } from "@/hooks/optimized/useScriptsOptimized";

interface ScriptEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  script: Script | null;
  onSave: (id: string, updates: any) => void;
}

export const ScriptEditDialog = ({ 
  isOpen, 
  onOpenChange, 
  script, 
  onSave 
}: ScriptEditDialogProps) => {
  const [editingScript, setEditingScript] = useState<any>(null);

  // Update editingScript when script prop changes and dialog is open
  useEffect(() => {
    if (isOpen && script) {
      setEditingScript({ 
        ...script, 
        tags: script.tags.join(', ') 
      });
    } else if (!isOpen) {
      setEditingScript(null);
    }
  }, [isOpen, script]);

  const handleOpen = (open: boolean) => {
    onOpenChange(open);
  };

  const handleSave = () => {
    if (!editingScript) return;
    
    const updates = {
      title: editingScript.title,
      script: editingScript.script,
      duration: editingScript.duration,
      tags: editingScript.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    };
    
    onSave(editingScript.id, updates);
    handleOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-butter-glow">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Edit Script</DialogTitle>
          <DialogDescription>
            Make changes to your script. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {editingScript && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={editingScript.title} 
                onChange={e => setEditingScript(prev => ({
                  ...prev,
                  title: e.target.value
                }))} 
                className="col-span-3" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-script">Script Content</Label>
              <Textarea 
                id="edit-script" 
                value={editingScript.script} 
                onChange={e => setEditingScript(prev => ({
                  ...prev,
                  script: e.target.value
                }))} 
                className="col-span-3 min-h-[120px]" 
              />
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input 
                id="edit-tags" 
                value={editingScript.tags} 
                onChange={e => setEditingScript(prev => ({
                  ...prev,
                  tags: e.target.value
                }))} 
                placeholder="script, video, content" 
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
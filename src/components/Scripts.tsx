import { useState } from "react";
import { FileText, Download, Eye, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ItemCard } from "@/components/common/ItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useScripts } from "@/hooks/useScripts";
interface ScriptsProps {
  selectedBrandId?: string | null;
}

export function Scripts({ selectedBrandId }: ScriptsProps) {
  const { scripts, loading, updateScript, removeScript } = useScripts(selectedBrandId);
  const [editingScript, setEditingScript] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [previewScript, setPreviewScript] = useState<any>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = (script: string) => {
    navigator.clipboard.writeText(script);
    toast({ title: "Script copied to clipboard", description: "The script has been copied to your clipboard." });
  };

  const handleRemove = (id: string) => {
    removeScript(id);
  };

  const handleEdit = (script: any) => {
    setEditingScript({ ...script, tags: script.tags.join(', ') });
    setIsEditDialogOpen(true);
  };

  const handlePreview = (script: any) => {
    setPreviewScript(script);
    setIsPreviewDialogOpen(true);
  };

  const handleDownload = (script: any) => {
    const element = document.createElement("a");
    const file = new Blob([script.script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: "Script downloaded", description: "The script has been downloaded to your device." });
  };
  
  const handleSaveEdit = () => {
    if (!editingScript) return;
    const updates = {
      title: editingScript.title,
      script: editingScript.script,
      duration: editingScript.duration,
      platform: editingScript.platform,
      tags: editingScript.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    };
    updateScript(editingScript.id, updates);
    setIsEditDialogOpen(false);
    setEditingScript(null);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingScript(null);
  };

  return <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Your Scripts</h1>
        <p className="text-muted-foreground">
          {selectedBrandId 
            ? "Your collection of scripts for the selected brand, ready to use for your content creation."
            : "Your collection of scripts, ready to use for your content creation. Select a brand to filter scripts."
          }
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : scripts.length === 0 && selectedBrandId ? (
        <EmptyState
          icon={FileText}
          title="No Scripts for This Brand Yet"
          description="Create scripts for this brand to see them here."
        />
      ) : scripts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Scripts Yet"
          description="Select a brand and generate scripts from your ideas to see them here."
        />
      ) : (
        <div className="grid gap-6">
          {scripts.map(script => {
            // Create enhanced item with content as script
            const enhancedScript = {
              ...script,
              content: script.script, // Map script to content for ItemCard
              platform: `${script.platform} • ${script.duration}`
            };
            
            return (
              <ItemCard
                key={script.id}
                item={enhancedScript}
                onCopy={(content) => handleCopy(script.script)}
                onEdit={handleEdit}
                onRemove={handleRemove}
                primaryAction={{
                  label: "Preview",
                  icon: Eye,
                  onClick: handlePreview
                }}
                additionalActions={[
                  {
                    label: "Download",
                    icon: Download,
                    onClick: handleDownload
                  }
                ]}
              />
            );
          })}
        </div>
      )}

      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-butter-glow">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Script</DialogTitle>
            <DialogDescription>
              Make changes to your script. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {editingScript && <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editingScript.title} onChange={e => setEditingScript(prev => ({
              ...prev,
              title: e.target.value
            }))} className="col-span-3" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-script">Script</Label>
                <Textarea id="edit-script" value={editingScript.script} onChange={e => setEditingScript(prev => ({
              ...prev,
              script: e.target.value
            }))} className="col-span-3 min-h-[200px] font-mono" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input id="edit-duration" value={editingScript.duration} onChange={e => setEditingScript(prev => ({
              ...prev,
              duration: e.target.value
            }))} className="col-span-3" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input id="edit-tags" value={editingScript.tags} onChange={e => setEditingScript(prev => ({
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card border-border shadow-butter-glow">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Script Preview</DialogTitle>
            <DialogDescription>
              Full preview of your script content.
            </DialogDescription>
          </DialogHeader>
          
          {previewScript && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h3 className="font-sans font-bold text-lg">{previewScript.title}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Script Content</Label>
                <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {previewScript.script}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => handleCopy(previewScript?.script || "")} 
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
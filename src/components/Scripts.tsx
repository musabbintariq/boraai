import { useState } from "react";
import { FileText, Copy, Trash2, Edit, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data for saved scripts
const mockScripts = [
  {
    id: 1,
    title: "Summer Fashion Trends Script",
    script: "Hey everyone! 👋 Summer is here and it's time to refresh your wardrobe with the hottest trends. Today I'm sharing my top 5 picks that will make you stand out this season...",
    duration: "45 seconds",
    platform: "Instagram",
    createdAt: "2024-01-15",
    tags: ["fashion", "summer", "trends"]
  },
  {
    id: 2,
    title: "Professional LinkedIn Script",
    script: "The key to writing compelling LinkedIn posts isn't about being perfect - it's about being authentic. Here are 3 strategies I've learned that transformed my professional presence...",
    duration: "1 minute",
    platform: "LinkedIn",
    createdAt: "2024-01-14",
    tags: ["professional", "networking", "content"]
  },
  {
    id: 3,
    title: "Brand Storytelling Script",
    script: "Every brand has a story, but not every story connects. Today I want to share how we transformed our brand narrative and saw a 300% increase in engagement...",
    duration: "2 minutes",
    platform: "YouTube",
    createdAt: "2024-01-13",
    tags: ["storytelling", "branding", "engagement"]
  }
];

export function Scripts() {
  const [scripts, setScripts] = useState(mockScripts);
  const [editingScript, setEditingScript] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = (script: string) => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Script copied to clipboard",
      description: "The script has been copied to your clipboard."
    });
  };

  const handleRemove = (id: number) => {
    setScripts(prev => prev.filter(script => script.id !== id));
    toast({
      title: "Script removed",
      description: "The script has been removed from your library."
    });
  };

  const handleEdit = (script: any) => {
    setEditingScript({
      ...script,
      tags: script.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingScript) return;
    
    const updatedScript = {
      ...editingScript,
      tags: editingScript.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    };
    
    setScripts(prev => prev.map(script => script.id === updatedScript.id ? updatedScript : script));
    setIsEditDialogOpen(false);
    setEditingScript(null);
    toast({
      title: "Script updated",
      description: "Your script has been successfully updated."
    });
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingScript(null);
  };

  const handleDownload = (script: any) => {
    const element = document.createElement("a");
    const file = new Blob([script.script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Script downloaded",
      description: "The script has been downloaded to your device."
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Scripts Library</h1>
        <p className="text-muted-foreground">
          Your collection of generated scripts, ready to use for your content creation.
        </p>
      </div>

      {scripts.length === 0 ? (
        <Card className="bg-card border-border text-center py-12 shadow-butter-glow">
          <CardContent>
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle className="font-serif mb-2">No Scripts Yet</CardTitle>
            <CardDescription>
              Generate scripts from your ideas to see them here.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {scripts.map(script => (
            <Card key={script.id} className="bg-card border-border shadow-butter-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-sans font-bold text-xl mb-2">{script.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{script.platform}</Badge>
                      <Badge variant="outline">{script.duration}</Badge>
                      <span className="text-sm text-muted-foreground">{script.createdAt}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemove(script.id)} 
                    className="h-8 w-8 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-mono leading-relaxed">{script.script}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {script.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(script.script)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(script)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(script)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
          
          {editingScript && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={editingScript.title} 
                  onChange={e => setEditingScript(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-script">Script</Label>
                <Textarea 
                  id="edit-script" 
                  value={editingScript.script} 
                  onChange={e => setEditingScript(prev => ({ ...prev, script: e.target.value }))}
                  className="col-span-3 min-h-[200px] font-mono" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input 
                  id="edit-duration" 
                  value={editingScript.duration} 
                  onChange={e => setEditingScript(prev => ({ ...prev, duration: e.target.value }))}
                  className="col-span-3" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input 
                  id="edit-tags" 
                  value={editingScript.tags} 
                  onChange={e => setEditingScript(prev => ({ ...prev, tags: e.target.value }))}
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
            <Button 
              onClick={handleSaveEdit} 
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
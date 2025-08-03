import { useState } from "react";
import { Copy, Download, Edit, Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ItemCard } from "@/components/common/ItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ScriptEditDialog } from "./ScriptEditDialog";
import { ScriptPreviewDialog } from "./ScriptPreviewDialog";
import { useScriptsOptimized } from "@/hooks/optimized/useScriptsOptimized";

export function ScriptsOptimized() {
  const { scripts, loading, updateScript, removeScript } = useScriptsOptimized();
  const [editingScript, setEditingScript] = useState<any>(null);
  const [previewingScript, setPreviewingScript] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ 
      title: "Copied to clipboard", 
      description: "Script content has been copied to your clipboard." 
    });
  };

  const handleEdit = (script: any) => {
    console.log('Editing script:', script);
    // Ensure we have the original script object with the correct structure
    const originalScript = scripts.find(s => s.id === script.id) || script;
    console.log('Original script:', originalScript);
    setEditingScript(originalScript);
    setIsEditDialogOpen(true);
  };

  const handlePreview = (script: any) => {
    setPreviewingScript(script);
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
    
    toast({ 
      title: "Downloaded", 
      description: "Script has been downloaded as a text file." 
    });
  };

  const handleRemove = (id: string) => {
    removeScript(id);
  };

  const handleSaveEdit = (id: string, updates: any) => {
    updateScript(id, updates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <EmptyState 
        icon={FileText}
        title="No Scripts Yet"
        description="Create your first script by converting content ideas or start from scratch."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Scripts Collection</h1>
        <p className="text-muted-foreground">
          Your library of scripts ready for content creation.
        </p>
      </div>

      <div className="grid gap-6">
        {scripts.map(script => (
          <ItemCard
            key={script.id}
            item={script}
            contentKey="script"
            extraData={{ content: script.script }}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onRemove={handleRemove}
            primaryAction={{
              label: "Preview",
              icon: Eye,
              onClick: handlePreview
            }}
            secondaryActions={[
              {
                label: "Download",
                icon: Download,
                onClick: handleDownload
              }
            ]}
          />
        ))}
      </div>

      <ScriptEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        script={editingScript}
        onSave={handleSaveEdit}
      />

      <ScriptPreviewDialog
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        script={previewingScript}
      />
    </div>
  );
}
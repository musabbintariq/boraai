import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Script } from "@/hooks/optimized/useScriptsOptimized";

interface ScriptPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  script: Script | null;
}

export const ScriptPreviewDialog = ({ 
  isOpen, 
  onOpenChange, 
  script 
}: ScriptPreviewDialogProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (script) {
      navigator.clipboard.writeText(script.script);
      toast({ 
        title: "Copied to clipboard", 
        description: "Script content has been copied to your clipboard." 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border shadow-butter-glow">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center justify-between">
            {script?.title}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="ml-4"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {script?.script}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
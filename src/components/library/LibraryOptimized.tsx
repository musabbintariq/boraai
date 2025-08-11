import { useState } from "react";
import { Heart, Plus, FileText, Loader2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ItemCard } from "@/components/common/ItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { IdeaFeedback } from "@/components/IdeaFeedback";
import { EditIdeaDialog } from "./EditIdeaDialog";
import { GenerateIdeasDialog } from "./GenerateIdeasDialog";
import { useContentIdeasOptimized } from "@/hooks/optimized/useContentIdeasOptimized";
import { useGeneratedIdeas } from "@/hooks/useGeneratedIdeas";
import { useScriptsOptimized } from "@/hooks/optimized/useScriptsOptimized";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function LibraryOptimized() {
  const { ideas, loading, updateIdea, removeIdea } = useContentIdeasOptimized();
  const { pendingIdeas } = useGeneratedIdeas();
  const { addScript } = useScriptsOptimized();
  const { user } = useAuth();
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ 
      title: "Copied to clipboard", 
      description: "Content has been copied to your clipboard." 
    });
  };

  const handleRemove = (id: string) => {
    removeIdea(id);
  };

  const handleScriptIt = async (idea: any) => {
    console.log('Scripting idea:', idea.title);
    if (!user) {
      console.log('No user found, aborting script generation');
      return;
    }
    
    console.log('Starting script generation for idea:', idea);
    
    toast({ 
      title: "Generating script...", 
      description: `Creating script for: ${idea.title}` 
    });

    try {
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: {
          idea: {
            title: idea.title,
            content: idea.content,
            platform: idea.platform,
            tags: idea.tags,
            brand_id: idea.brand_id
          },
          userId: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Script generated!",
          description: "Your script has been created and saved."
        });
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (idea: any) => {
    // Ensure we have the original idea object with the correct structure
    const originalIdea = ideas.find(i => i.id === idea.id) || idea;
    setEditingIdea(originalIdea);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = (id: string, updates: any) => {
    updateIdea(id, updates);
  };

  return (
    <div className="max-w-4xl mx-auto">
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

      <EditIdeaDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        idea={editingIdea}
        onSave={handleSaveEdit}
      />

      <GenerateIdeasDialog
        isOpen={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      />
    </div>
  );
}
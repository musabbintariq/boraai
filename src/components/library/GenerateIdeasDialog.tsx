import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGeneratedIdeas } from "@/hooks/useGeneratedIdeas";

interface GenerateIdeasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBrandId?: string | null;
}

interface GenerateFormData {
  topic?: string;
  competitorsSocialLinks: string;
  platforms: string;
}

export const GenerateIdeasDialog = ({ 
  isOpen, 
  onOpenChange,
  selectedBrandId 
}: GenerateIdeasDialogProps) => {
  const [formData, setFormData] = useState<GenerateFormData>({
    topic: "",
    competitorsSocialLinks: "",
    platforms: "",
  });
  const { saveGeneratedIdea } = useGeneratedIdeas();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock generation - in real app this would call an AI service
    const mockIdeas = [
      {
        title: "Behind the Scenes Content",
        content: `Show your audience what goes on behind the scenes of your business. People love authentic content that gives them a peek into your process.`,
        platform: formData.platforms,
        tags: ["behind-the-scenes", "authentic", "process"],
        generation_context: { ...formData, timestamp: new Date().toISOString() },
        brandId: selectedBrandId || undefined
      },
      {
        title: "Industry Tips & Tricks",
        content: `Share valuable tips and tricks${formData.topic ? ` about ${formData.topic}` : ''}. Position yourself as an expert while providing genuine value to your audience.`,
        platform: formData.platforms,
        tags: ["tips", "expert", "value"],
        generation_context: { ...formData, timestamp: new Date().toISOString() },
        brandId: selectedBrandId || undefined
      },
      {
        title: "Customer Success Story",
        content: `Feature a customer success story showing how your products or services made a difference. Social proof is powerful content.`,
        platform: formData.platforms,
        tags: ["testimonial", "success-story", "social-proof"],
        generation_context: { ...formData, timestamp: new Date().toISOString() },
        brandId: selectedBrandId || undefined
      }
    ];

    // Save generated ideas to the database
    for (const idea of mockIdeas) {
      await saveGeneratedIdea(idea);
    }

    toast({
      title: "Ideas generated!",
      description: `${mockIdeas.length} content ideas are ready for your review.`
    });
    
    onOpenChange(false);
    setFormData({
      topic: "",
      competitorsSocialLinks: "",
      platforms: "",
    });
  };

  const handlePlatformChange = (value: string) => {
    setFormData(prev => ({ ...prev, platforms: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card border-border shadow-butter-glow">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Generate Content Ideas</DialogTitle>
          <DialogDescription>
            Fill in the details below to generate personalized content ideas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">

          <div className="space-y-2">
            <Label htmlFor="topic">Any topic in mind</Label>
            <Input
              id="topic"
              placeholder="any concept or idea in mind"
              value={formData.topic || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitorsSocialLinks">Competitors' Social Links</Label>
            <Textarea
              id="competitorsSocialLinks"
              placeholder="Enter competitor social media links (one per line)"
              value={formData.competitorsSocialLinks}
              onChange={(e) => setFormData(prev => ({ ...prev, competitorsSocialLinks: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Platforms to Target</Label>
            <Select value={formData.platforms} onValueChange={handlePlatformChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
};
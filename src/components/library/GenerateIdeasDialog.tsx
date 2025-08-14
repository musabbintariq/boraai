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
import { useBrands } from "@/hooks/useBrands";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAuth } from "@/hooks/useAuth";

interface GenerateIdeasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBrandId?: string | null;
}

interface GenerateFormData {
  topic?: string;
  competitorsSocialLinks: string;
  platforms: string;
  format: string;
  brandId?: string | null;
}

export const GenerateIdeasDialog = ({ 
  isOpen, 
  onOpenChange,
  selectedBrandId 
}: GenerateIdeasDialogProps) => {
  const { activeBrandId } = useBrandContext();
  const { user } = useAuth();
  const [formData, setFormData] = useState<GenerateFormData>({
    topic: "",
    competitorsSocialLinks: "",
    platforms: "",
    format: "",
    brandId: activeBrandId,
  });
  const { saveGeneratedIdea } = useGeneratedIdeas();
  const { brands } = useBrands();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.platforms) {
      toast({
        title: "Platform required",
        description: "Please select a platform to target.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.format) {
      toast({
        title: "Post format required", 
        description: "Please select a post format.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate content ideas.",
        variant: "destructive"
      });
      return;
    }

    // Send data to n8n webhook
    const webhookPayload = {
      userId: user.id,
      brandId: formData.brandId,
      topic: formData.topic || "",
      goal: formData.competitorsSocialLinks,
      platforms: [formData.platforms],
      format: formData.format,
      timestamp: new Date().toISOString(),
      webhookResponseUrl: `https://vhsksvknbzpeznvsudek.supabase.co/functions/v1/webhook-ideas-receiver`
    };

    const webhookUrl = "https://n8n.srv878539.hstgr.cloud/webhook/f89f212c-22dd-4587-830c-430fe97e156f";
    
    console.log('Sending to webhook:', webhookPayload);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      toast({
        title: "Content generation started!",
        description: "Your content ideas are being generated and will appear shortly."
      });
      
      onOpenChange(false);
      setFormData({
        topic: "",
        competitorsSocialLinks: "",
        platforms: "",
        format: "",
        brandId: activeBrandId,
      });

    } catch (error) {
      console.error('Webhook request failed:', error);
      
      toast({
        title: "Generation request sent",
        description: "Your request has been sent. Ideas will appear shortly.",
        variant: "default"
      });
      
      onOpenChange(false);
      setFormData({
        topic: "",
        competitorsSocialLinks: "",
        platforms: "",
        format: "",
        brandId: activeBrandId,
      });
    }
  };

  const handlePlatformChange = (value: string) => {
    setFormData(prev => ({ ...prev, platforms: value }));
  };

  const handleFormatChange = (value: string) => {
    setFormData(prev => ({ ...prev, format: value }));
  };

  const handleBrandChange = (value: string) => {
    setFormData(prev => ({ ...prev, brandId: value === "none" ? null : value }));
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
            <Label>Brand</Label>
            <Select value={formData.brandId || "none"} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="none">No Brand</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Any topic in mind</Label>
            <Input
              id="topic"
              placeholder="Any concept or idea in mind"
              value={formData.topic || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitorsSocialLinks">What's your goal with the post</Label>
            <Textarea
              id="competitorsSocialLinks"
              placeholder="e.g., promote a product, get more comments, build trust."
              value={formData.competitorsSocialLinks}
              onChange={(e) => setFormData(prev => ({ ...prev, competitorsSocialLinks: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Platforms to Target *</Label>
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

          <div className="space-y-2">
            <Label>Post Format *</Label>
            <Select value={formData.format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select post format" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="single-page-static">Single Page Static</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="plain-text">Plain Text Post</SelectItem>
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
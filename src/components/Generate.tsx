import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Generate() {
  const [formData, setFormData] = useState({
    brandName: "",
    niche: "",
    competitorsSocialLinks: "",
    platforms: [] as string[],
    competitorsPlatformLinks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generating content with:", formData);
    // TODO: Implement content generation logic
  };

  const handlePlatformChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(value)
        ? prev.platforms.filter(p => p !== value)
        : [...prev.platforms, value]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-4">Generate Content</h1>
        <p className="text-muted-foreground">
          Create amazing content for your brand by providing some basic information.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-sans font-bold">Content Generator</CardTitle>
          <CardDescription>
            Fill in the details below to generate personalized content ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                placeholder="Enter your brand name"
                value={formData.brandName}
                onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., Fashion, Technology, Food & Beverage"
                value={formData.niche}
                onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorsSocialLinks">Competitors' Social Links</Label>
              <Textarea
                id="competitorsSocialLinks"
                placeholder="Enter competitor social media links (one per line)"
                value={formData.competitorsSocialLinks}
                onChange={(e) => setFormData(prev => ({ ...prev, competitorsSocialLinks: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Platforms to Target</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="instagram"
                    checked={formData.platforms.includes("instagram")}
                    onChange={() => handlePlatformChange("instagram")}
                    className="rounded border-border"
                  />
                  <Label htmlFor="instagram">Instagram</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="linkedin"
                    checked={formData.platforms.includes("linkedin")}
                    onChange={() => handlePlatformChange("linkedin")}
                    className="rounded border-border"
                  />
                  <Label htmlFor="linkedin">LinkedIn</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorsPlatformLinks">Competitor's Platform Links</Label>
              <Textarea
                id="competitorsPlatformLinks"
                placeholder="Enter specific competitor platform links"
                value={formData.competitorsPlatformLinks}
                onChange={(e) => setFormData(prev => ({ ...prev, competitorsPlatformLinks: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
              size="lg"
            >
              Generate Content
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
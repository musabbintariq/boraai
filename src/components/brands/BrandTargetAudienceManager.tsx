import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Import Input separately to avoid module resolution issues
import { Input } from "@/components/ui/input";

interface TargetAudience {
  id?: string;
  brand_id: string;
  niche_description: string;
  demographics: any;
  pain_points: string[];
  goals: string[];
  psychographics: any;
  preferred_platforms: string[];
  content_preferences: string[];
}

interface BrandTargetAudienceManagerProps {
  brandId: string;
}

export function BrandTargetAudienceManager({ brandId }: BrandTargetAudienceManagerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasPersona, setHasPersona] = useState(false);
  const [nicheInput, setNicheInput] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  const [persona, setPersona] = useState<TargetAudience>({
    brand_id: brandId,
    niche_description: "",
    demographics: {
      ageRange: "",
      gender: "",
      location: "",
      income: ""
    },
    pain_points: [],
    goals: [],
    psychographics: {
      interests: [],
      values: [],
      lifestyle: ""
    },
    preferred_platforms: [],
    content_preferences: []
  });

  useEffect(() => {
    if (user && brandId) {
      fetchTargetAudience();
    }
  }, [user, brandId]);

  const fetchTargetAudience = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('target_audience_profiles')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPersona(data);
        setHasPersona(true);
        setIsEditing(false);
      } else {
        setHasPersona(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching target audience:', error);
      toast.error('Failed to load target audience profile');
    } finally {
      setLoading(false);
    }
  };

  const generatePersona = async () => {
    if (!nicheInput.trim()) {
      toast.error('Please describe the niche first');
      return;
    }

    if (!webhookUrl.trim()) {
      toast.error('Please enter your n8n webhook URL');
      return;
    }

    setGenerating(true);
    try {
      // Call n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche_description: nicheInput,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to n8n workflow');
      }

      const result = await response.json();
      
      // Use the response from n8n workflow to populate the persona
      const generatedPersona: TargetAudience = {
        brand_id: brandId,
        niche_description: result.niche_description || nicheInput,
        demographics: result.demographics || {
          ageRange: "25-45",
          gender: "All genders", 
          location: "Urban areas, North America & Europe",
          income: "$50,000 - $150,000"
        },
        pain_points: result.pain_points || [
          "Lack of time for content creation",
          "Difficulty staying consistent",
          "Struggling with engagement",
          "Limited design skills"
        ],
        goals: result.goals || [
          "Build authentic brand presence",
          "Increase online engagement", 
          "Save time on content creation",
          "Grow their audience"
        ],
        psychographics: result.psychographics || {
          interests: ["Digital marketing", "Entrepreneurship", "Social media trends", "Business growth"],
          values: ["Authenticity", "Quality", "Innovation", "Efficiency"],
          lifestyle: "Busy professionals seeking work-life balance"
        },
        preferred_platforms: result.preferred_platforms || ["Instagram", "LinkedIn", "TikTok", "Twitter"],
        content_preferences: result.content_preferences || ["Visual content", "Quick tips", "Behind-the-scenes", "Success stories"]
      };

      setPersona(generatedPersona);
      toast.success('Target audience persona generated successfully using n8n workflow!');
    } catch (error) {
      console.error('Error generating persona:', error);
      toast.error('Failed to generate persona. Please check your n8n webhook URL and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const saveTargetAudience = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('target_audience_profiles')
        .upsert({
          brand_id: brandId,
          ...persona
        });

      if (error) throw error;

      toast.success('Target audience profile saved successfully!');
      setHasPersona(true);
      setIsEditing(false);
      await fetchTargetAudience();
    } catch (error) {
      console.error('Error saving target audience:', error);
      toast.error('Failed to save target audience profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isEditing && hasPersona) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Target Audience Persona</CardTitle>
          <CardDescription>Your brand's ideal customer profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {persona.niche_description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">NICHE DESCRIPTION</Label>
              <p className="mt-1">{persona.niche_description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">DEMOGRAPHICS</Label>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Age:</span> {persona.demographics?.ageRange || "Not specified"}</p>
                <p><span className="font-medium">Gender:</span> {persona.demographics?.gender || "Not specified"}</p>
                <p><span className="font-medium">Location:</span> {persona.demographics?.location || "Not specified"}</p>
                <p><span className="font-medium">Income:</span> {persona.demographics?.income || "Not specified"}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">LIFESTYLE</Label>
              <p className="mt-2 text-sm">{persona.psychographics?.lifestyle || "Not specified"}</p>
            </div>
          </div>

          {persona.pain_points.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">PAIN POINTS</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {persona.pain_points.map((point, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 border-red-200">{point}</Badge>
                ))}
              </div>
            </div>
          )}

          {persona.goals.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">GOALS</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {persona.goals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 border-green-200">{goal}</Badge>
                ))}
              </div>
            </div>
          )}

          {persona.preferred_platforms.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">PREFERRED PLATFORMS</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {persona.preferred_platforms.map((platform, index) => (
                  <Badge key={index} variant="secondary">{platform}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setIsEditing(true)} className="w-full">
            Edit Persona
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hasPersona ? "Edit Target Audience Persona" : "Create Target Audience Persona"}</CardTitle>
        <CardDescription>Define who this brand should target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasPersona && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhookUrl">n8n Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your n8n webhook URL that will generate the target audience persona
              </p>
            </div>
            
            <div>
              <Label htmlFor="niche">Describe your niche/target market</Label>
              <Textarea
                id="niche"
                placeholder="E.g., Small business owners who need help with social media marketing, fitness enthusiasts looking for home workout solutions..."
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
            
            <Button 
              onClick={generatePersona} 
              disabled={!nicheInput.trim() || !webhookUrl.trim() || generating}
              className="w-full"
            >
              {generating ? "Generating Persona via n8n..." : "Generate Target Audience Persona"}
            </Button>
          </div>
        )}

        {(hasPersona || persona.niche_description) && (
          <>
            <div>
              <Label>Niche Description</Label>
              <Textarea
                value={persona.niche_description}
                onChange={(e) => setPersona(prev => ({ ...prev, niche_description: e.target.value }))}
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              {hasPersona && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
              )}
              <Button onClick={saveTargetAudience} disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Save Persona"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
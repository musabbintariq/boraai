import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface TargetAudience {
  id?: string;
  brand_id: string;
  niche_description: string;
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    income: string;
  };
  pain_points: string[];
  goals: string[];
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string;
  };
  preferred_platforms: string[];
  content_preferences: string[];
  communication_style: string;
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
    content_preferences: [],
    communication_style: ""
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

    setGenerating(true);
    try {
      // Simulate AI generation with realistic data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedPersona: TargetAudience = {
        brand_id: brandId,
        niche_description: nicheInput,
        demographics: {
          ageRange: "25-45",
          gender: "All genders",
          location: "Urban areas, North America & Europe",
          income: "$50,000 - $150,000"
        },
        pain_points: [
          "Lack of time for content creation",
          "Difficulty staying consistent",
          "Struggling with engagement",
          "Limited design skills"
        ],
        goals: [
          "Build authentic brand presence",
          "Increase online engagement",
          "Save time on content creation",
          "Grow their audience"
        ],
        psychographics: {
          interests: ["Digital marketing", "Entrepreneurship", "Social media trends", "Business growth"],
          values: ["Authenticity", "Quality", "Innovation", "Efficiency"],
          lifestyle: "Busy professionals seeking work-life balance"
        },
        preferred_platforms: ["Instagram", "LinkedIn", "TikTok", "Twitter"],
        content_preferences: ["Visual content", "Quick tips", "Behind-the-scenes", "Success stories"],
        communication_style: "Professional yet approachable, clear and actionable"
      };

      setPersona(generatedPersona);
      toast.success('Target audience persona generated successfully!');
    } catch (error) {
      console.error('Error generating persona:', error);
      toast.error('Failed to generate persona');
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
                <p><span className="font-medium">Age:</span> {persona.demographics.ageRange}</p>
                <p><span className="font-medium">Gender:</span> {persona.demographics.gender}</p>
                <p><span className="font-medium">Location:</span> {persona.demographics.location}</p>
                <p><span className="font-medium">Income:</span> {persona.demographics.income}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">LIFESTYLE</Label>
              <p className="mt-2 text-sm">{persona.psychographics.lifestyle}</p>
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
            <Button 
              onClick={generatePersona} 
              disabled={!nicheInput.trim() || generating}
              className="mt-3 w-full"
            >
              {generating ? "Generating Persona..." : "Generate Target Audience Persona"}
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

            <div>
              <Label>Communication Style</Label>
              <Textarea
                placeholder="How should this brand communicate with its audience?"
                value={persona.communication_style}
                onChange={(e) => setPersona(prev => ({ ...prev, communication_style: e.target.value }))}
                rows={2}
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
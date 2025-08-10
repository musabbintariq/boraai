import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TargetAudience {
  niche_description: string;
  target_audience_description: string;
  demographics: string;
  psychographics: string;
  pain_points: string[];
  goals: string[];
  preferred_platforms: string[];
  content_preferences: string[];
  buying_behavior: string;
  communication_style: string;
}

export function SimplifiedTargetAudience() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasPersona, setHasPersona] = useState(false);
  
  const [nicheDescription, setNicheDescription] = useState("");
  const [targetAudienceInput, setTargetAudienceInput] = useState("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience | null>(null);

  useEffect(() => {
    if (user) {
      fetchTargetAudience();
    }
  }, [user]);

  const fetchTargetAudience = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("target_audience_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTargetAudience({
          niche_description: data.niche_description || "",
          target_audience_description: data.target_audience_input || "",
          demographics: String(data.demographics || ""),
          psychographics: String(data.psychographics || ""),
          pain_points: data.pain_points || [],
          goals: data.goals || [],
          preferred_platforms: data.preferred_platforms || [],
          content_preferences: data.content_preferences || [],
          buying_behavior: data.buying_behavior || "",
          communication_style: data.communication_style || ""
        });
        setNicheDescription(data.niche_description || "");
        setTargetAudienceInput(data.target_audience_input || "");
        setHasPersona(true);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching target audience:", error);
      toast({
        title: "Error",
        description: "Failed to load target audience profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePersona = async () => {
    if (!nicheDescription.trim()) return;
    
    setGenerating(true);
    
    // Simulate AI generation with realistic data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedPersona: TargetAudience = {
      niche_description: nicheDescription,
      target_audience_description: targetAudienceInput,
      demographics: "Primary: 28-45 years old, 60% female, 40% male. College-educated professionals with household income $50K-$120K. Located primarily in urban and suburban areas.",
      psychographics: "Values efficiency, personal growth, and work-life balance. Tech-savvy early adopters who research before purchasing. Motivated by achievement and self-improvement.",
      pain_points: [
        "Limited time for personal development",
        "Difficulty staying organized",
        "Information overload",
        "Balancing multiple priorities"
      ],
      goals: [
        "Improve productivity and efficiency",
        "Achieve better work-life balance",
        "Advance career prospects",
        "Develop new skills"
      ],
      preferred_platforms: [
        "LinkedIn",
        "Instagram",
        "YouTube",
        "Email newsletters"
      ],
      content_preferences: [
        "How-to guides and tutorials",
        "Quick tips and actionable advice",
        "Success stories and case studies",
        "Tool reviews and recommendations"
      ],
      buying_behavior: "Research-driven buyers who read reviews, compare options, and seek recommendations from trusted sources before making decisions.",
      communication_style: "Prefers clear, concise communication with actionable takeaways. Responds well to authentic, helpful content that provides immediate value."
    };
    
    setTargetAudience(generatedPersona);
    setGenerating(false);
  };

  const saveTargetAudience = async () => {
    if (!user || !targetAudience) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("target_audience_profiles")
        .upsert({
          user_id: user.id,
          niche_description: targetAudience.niche_description,
          target_audience_input: targetAudience.target_audience_description,
          demographics: targetAudience.demographics,
          psychographics: targetAudience.psychographics,
          pain_points: targetAudience.pain_points,
          goals: targetAudience.goals,
          preferred_platforms: targetAudience.preferred_platforms,
          content_preferences: targetAudience.content_preferences,
          buying_behavior: targetAudience.buying_behavior,
          communication_style: targetAudience.communication_style
        });

      if (error) throw error;

      setHasPersona(true);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Target audience profile saved successfully",
      });
    } catch (error) {
      console.error("Error saving target audience:", error);
      toast({
        title: "Error",
        description: "Failed to save target audience profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading target audience profile...</div>;
  }

  if (!isEditing && hasPersona && targetAudience) {
    // View mode
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Target Audience Persona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Niche:</strong> {targetAudience.niche_description}</div>
            
            {targetAudience.target_audience_description && (
              <div><strong>Target Audience:</strong> {targetAudience.target_audience_description}</div>
            )}
            
            <div><strong>Demographics:</strong> {targetAudience.demographics}</div>
            <div><strong>Psychographics:</strong> {targetAudience.psychographics}</div>
            
            {targetAudience.pain_points.length > 0 && (
              <div>
                <strong>Pain Points:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {targetAudience.pain_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {targetAudience.goals.length > 0 && (
              <div>
                <strong>Goals:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {targetAudience.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {targetAudience.preferred_platforms.length > 0 && (
              <div>
                <strong>Preferred Platforms:</strong> {targetAudience.preferred_platforms.join(", ")}
              </div>
            )}
            
            {targetAudience.content_preferences.length > 0 && (
              <div>
                <strong>Content Preferences:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {targetAudience.content_preferences.map((pref, index) => (
                    <li key={index}>{pref}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div><strong>Buying Behavior:</strong> {targetAudience.buying_behavior}</div>
            <div><strong>Communication Style:</strong> {targetAudience.communication_style}</div>
            
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Edit Persona
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit/Generate mode
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {hasPersona ? "Edit Target Audience Persona" : "Generate Target Audience Persona"}
          </CardTitle>
          <p className="text-muted-foreground">
            Describe your niche to generate a detailed target audience persona.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche-desc">Niche Description</Label>
              <Textarea
                id="niche-desc"
                value={nicheDescription}
                onChange={(e) => setNicheDescription(e.target.value)}
                placeholder="Describe your niche in detail (e.g., 'I help busy professionals learn productivity strategies and time management techniques to achieve work-life balance')"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience-input">Target Audience in Mind (Optional)</Label>
              <Textarea
                id="audience-input"
                value={targetAudienceInput}
                onChange={(e) => setTargetAudienceInput(e.target.value)}
                placeholder="If you already have a specific target audience in mind, describe them here"
                className="min-h-[80px]"
              />
            </div>

            <Button 
              onClick={generatePersona} 
              disabled={generating || !nicheDescription.trim()}
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              {generating ? "Generating Persona..." : "Generate Persona"}
            </Button>
          </div>

          {targetAudience && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Generated Persona</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label className="font-medium">Demographics</Label>
                  <p className="text-sm text-muted-foreground mt-1">{targetAudience.demographics}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Psychographics</Label>
                  <p className="text-sm text-muted-foreground mt-1">{targetAudience.psychographics}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Pain Points</Label>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside space-y-1">
                    {targetAudience.pain_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Label className="font-medium">Goals</Label>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside space-y-1">
                    {targetAudience.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Label className="font-medium">Preferred Platforms</Label>
                  <p className="text-sm text-muted-foreground mt-1">{targetAudience.preferred_platforms.join(", ")}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Content Preferences</Label>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside space-y-1">
                    {targetAudience.content_preferences.map((pref, index) => (
                      <li key={index}>{pref}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Label className="font-medium">Buying Behavior</Label>
                  <p className="text-sm text-muted-foreground mt-1">{targetAudience.buying_behavior}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Communication Style</Label>
                  <p className="text-sm text-muted-foreground mt-1">{targetAudience.communication_style}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={saveTargetAudience} disabled={saving}>
                  {saving ? "Saving..." : "Save Persona"}
                </Button>
                {hasPersona && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
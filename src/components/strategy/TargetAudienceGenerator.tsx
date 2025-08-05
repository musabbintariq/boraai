import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Sparkles, User, Target, Heart, DollarSign, MapPin, Calendar } from "lucide-react";

interface TargetAudience {
  niche_description: string;
  demographics: {
    age_range: string;
    gender: string;
    location: string;
    income_level: string;
    education: string;
    occupation: string;
  };
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string;
    personality: string;
  };
  pain_points: string[];
  goals: string[];
  preferred_platforms: string[];
  content_preferences: string[];
  buying_behavior: string;
  communication_style: string;
}

export function TargetAudienceGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [nicheDescription, setNicheDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience | null>(null);

  useEffect(() => {
    fetchTargetAudience();
  }, [user]);

  const fetchTargetAudience = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('target_audience_profiles' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setNicheDescription((data as any).niche_description || "");
        setTargetAudience({
          niche_description: (data as any).niche_description || "",
          demographics: (data as any).demographics || {},
          psychographics: (data as any).psychographics || {},
          pain_points: (data as any).pain_points || [],
          goals: (data as any).goals || [],
          preferred_platforms: (data as any).preferred_platforms || [],
          content_preferences: (data as any).content_preferences || [],
          buying_behavior: (data as any).buying_behavior || "",
          communication_style: (data as any).communication_style || ""
        });
      }
    } catch (error) {
      console.error('Error fetching target audience:', error);
      toast({
        title: "Error",
        description: "Failed to load target audience profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePersona = async () => {
    if (!nicheDescription.trim()) {
      toast({
        title: "Niche Required",
        description: "Please enter your niche description first",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      // Mock generation - in real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockPersona: TargetAudience = {
        niche_description: nicheDescription,
        demographics: {
          age_range: "25-40 years old",
          gender: "All genders, slight female majority (55%)",
          location: "Urban and suburban areas, primarily North America and Europe",
          income_level: "$40,000 - $80,000 annually",
          education: "College-educated or self-educated professionals",
          occupation: "Knowledge workers, entrepreneurs, freelancers"
        },
        psychographics: {
          interests: ["personal development", "productivity", "technology", "lifestyle optimization", "learning"],
          values: ["growth", "authenticity", "efficiency", "work-life balance", "continuous learning"],
          lifestyle: "Busy professionals seeking to improve their lives and careers",
          personality: "Goal-oriented, curious, tech-savvy, values-driven"
        },
        pain_points: [
          "Feeling overwhelmed by too many choices",
          "Struggling to find time for personal goals",
          "Information overload from too many sources",
          "Difficulty staying consistent with new habits",
          "Fear of making the wrong decisions"
        ],
        goals: [
          "Achieve better work-life balance",
          "Increase productivity and efficiency",
          "Learn new skills for career advancement",
          "Build meaningful relationships",
          "Create financial stability and growth"
        ],
        preferred_platforms: ["Instagram", "LinkedIn", "YouTube", "Email", "Podcasts"],
          content_preferences: [
            "How-to guides and tutorials",
            "Behind-the-scenes content",
            "Success stories and case studies",
            "Quick tips and actionable advice",
            "Tool and resource recommendations"
          ],
          buying_behavior: "Research-driven, values quality over quantity, prefers brands that align with their values",
          communication_style: "Prefers clear, actionable communication with personal touches"
        };

      setTargetAudience(mockPersona);
      
      toast({
        title: "Persona Generated!",
        description: "Your target audience persona has been created based on your niche"
      });
    } catch (error) {
      console.error('Error generating persona:', error);
      toast({
        title: "Error",
        description: "Failed to generate target audience persona",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const saveTargetAudience = async () => {
    if (!user || !targetAudience) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('target_audience_profiles' as any)
        .upsert({
          user_id: user.id,
          niche_description: nicheDescription,
          demographics: targetAudience.demographics,
          psychographics: targetAudience.psychographics,
          pain_points: targetAudience.pain_points,
          goals: targetAudience.goals,
          preferred_platforms: targetAudience.preferred_platforms,
          content_preferences: targetAudience.content_preferences,
          buying_behavior: targetAudience.buying_behavior,
          communication_style: targetAudience.communication_style,
          webhook_url: "", // Keep for backend use but not exposed in UI
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Target audience profile has been saved successfully"
      });
    } catch (error) {
      console.error('Error saving target audience:', error);
      toast({
        title: "Error",
        description: "Failed to save target audience profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Target Audience Persona Generator</CardTitle>
          <p className="text-muted-foreground">
            Generate a detailed audience persona based on your niche to better understand who you're creating content for
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche Description</Label>
              <Textarea
                id="niche"
                value={nicheDescription}
                onChange={(e) => setNicheDescription(e.target.value)}
                placeholder="Describe your niche in detail (e.g., 'I help busy professionals learn productivity strategies and time management techniques to achieve work-life balance')"
                className="min-h-[100px]"
              />
            </div>


            <Button 
              onClick={generatePersona} 
              disabled={generating || !nicheDescription.trim()}
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate Audience Persona
            </Button>
          </div>
        </CardContent>
      </Card>

      {targetAudience && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Age Range</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.age_range}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.gender}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Income Level</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.income_level}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Education</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.education}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Occupation</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.demographics.occupation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Psychographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {targetAudience.psychographics.interests.map(interest => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Values</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {targetAudience.psychographics.values.map(value => (
                    <Badge key={value} variant="outline">{value}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Lifestyle</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.psychographics.lifestyle}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Personality</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.psychographics.personality}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Pain Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {targetAudience.pain_points.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {targetAudience.goals.map((goal, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content & Communication Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Preferred Platforms</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {targetAudience.preferred_platforms.map(platform => (
                    <Badge key={platform} variant="secondary">{platform}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Content Preferences</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {targetAudience.content_preferences.map(pref => (
                    <Badge key={pref} variant="outline">{pref}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Communication Style</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.communication_style}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Buying Behavior</Label>
                <p className="text-sm text-muted-foreground">{targetAudience.buying_behavior}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={saveTargetAudience} 
              disabled={saving}
              className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Persona
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
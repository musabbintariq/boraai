import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BrandVoice {
  brand_name: string;
  tone: string;
  personality_traits: string[];
  communication_style: string;
  values: string;
  voice_description: string;
  do_use: string[];
  dont_use: string[];
}

const toneOptions = ["Professional", "Friendly", "Authoritative", "Casual", "Inspiring", "Educational"];
const styleOptions = ["Direct", "Conversational", "Formal", "Storytelling", "Technical", "Emotional"];

export function SimplifiedBrandVoice() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<BrandVoice>({
    brand_name: "",
    tone: "",
    personality_traits: [],
    communication_style: "",
    values: "",
    voice_description: "",
    do_use: [],
    dont_use: []
  });

  // Temporary input states
  const [newTrait, setNewTrait] = useState("");
  const [newDoUse, setNewDoUse] = useState("");
  const [newDontUse, setNewDontUse] = useState("");

  useEffect(() => {
    if (user) {
      fetchBrandVoice();
    }
  }, [user]);

  const fetchBrandVoice = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("brand_voice_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          brand_name: data.brand_name || "",
          tone: data.tone || "",
          personality_traits: data.personality_traits || [],
          communication_style: data.communication_style || "",
          values: data.values || "",
          voice_description: data.voice_description || "",
          do_use: data.do_use || [],
          dont_use: data.dont_use || []
        });
        setHasProfile(true);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching brand voice:", error);
      toast({
        title: "Error",
        description: "Failed to load brand voice profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBrandVoice = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("brand_voice_profiles")
        .upsert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;

      setHasProfile(true);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Brand voice profile saved successfully",
      });
    } catch (error) {
      console.error("Error saving brand voice:", error);
      toast({
        title: "Error",
        description: "Failed to save brand voice profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addTrait = () => {
    if (newTrait.trim() && !formData.personality_traits.includes(newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        personality_traits: [...prev.personality_traits, newTrait.trim()]
      }));
      setNewTrait("");
    }
  };

  const removeTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personality_traits: prev.personality_traits.filter(t => t !== trait)
    }));
  };

  const addDoUse = () => {
    if (newDoUse.trim() && !formData.do_use.includes(newDoUse.trim())) {
      setFormData(prev => ({
        ...prev,
        do_use: [...prev.do_use, newDoUse.trim()]
      }));
      setNewDoUse("");
    }
  };

  const removeDoUse = (item: string) => {
    setFormData(prev => ({
      ...prev,
      do_use: prev.do_use.filter(d => d !== item)
    }));
  };

  const addDontUse = () => {
    if (newDontUse.trim() && !formData.dont_use.includes(newDontUse.trim())) {
      setFormData(prev => ({
        ...prev,
        dont_use: [...prev.dont_use, newDontUse.trim()]
      }));
      setNewDontUse("");
    }
  };

  const removeDontUse = (item: string) => {
    setFormData(prev => ({
      ...prev,
      dont_use: prev.dont_use.filter(d => d !== item)
    }));
  };

  if (loading) {
    return <div className="p-4">Loading brand voice profile...</div>;
  }

  if (!isEditing && hasProfile) {
    // View mode
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Brand Voice Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Brand Name:</strong> {formData.brand_name}</div>
            <div><strong>Tone:</strong> {formData.tone}</div>
            <div><strong>Communication Style:</strong> {formData.communication_style}</div>
            
            {formData.personality_traits.length > 0 && (
              <div>
                <strong>Personality Traits:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.personality_traits.map(trait => (
                    <Badge key={trait} variant="secondary">{trait}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {formData.values && (
              <div><strong>Values:</strong> {formData.values}</div>
            )}
            
            {formData.voice_description && (
              <div><strong>Voice Description:</strong> {formData.voice_description}</div>
            )}
            
            {formData.do_use.length > 0 && (
              <div>
                <strong>Words to Use:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.do_use.map(item => (
                    <Badge key={item} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {formData.dont_use.length > 0 && (
              <div>
                <strong>Words to Avoid:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.dont_use.map(item => (
                    <Badge key={item} variant="destructive">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {hasProfile ? "Edit Brand Voice Profile" : "Create Brand Voice Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              value={formData.brand_name}
              onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
              placeholder="Enter your brand name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your brand tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => (
                    <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Communication Style</Label>
              <Select value={formData.communication_style} onValueChange={(value) => setFormData(prev => ({ ...prev, communication_style: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Personality Traits</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="Add a personality trait"
                onKeyDown={(e) => e.key === 'Enter' && addTrait()}
              />
              <Button onClick={addTrait} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.personality_traits.map(trait => (
                <Badge key={trait} variant="secondary" className="flex items-center gap-1">
                  {trait}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTrait(trait)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="values">Brand Values</Label>
            <Textarea
              id="values"
              value={formData.values}
              onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
              placeholder="Describe your brand's core values and beliefs"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-description">Voice Description</Label>
            <Textarea
              id="voice-description"
              value={formData.voice_description}
              onChange={(e) => setFormData(prev => ({ ...prev, voice_description: e.target.value }))}
              placeholder="Describe how your brand sounds and communicates"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Words/Phrases to Use</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newDoUse}
                  onChange={(e) => setNewDoUse(e.target.value)}
                  placeholder="Add words to use"
                  onKeyDown={(e) => e.key === 'Enter' && addDoUse()}
                />
                <Button onClick={addDoUse} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.do_use.map(item => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeDoUse(item)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Words/Phrases to Avoid</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newDontUse}
                  onChange={(e) => setNewDontUse(e.target.value)}
                  placeholder="Add words to avoid"
                  onKeyDown={(e) => e.key === 'Enter' && addDontUse()}
                />
                <Button onClick={addDontUse} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.dont_use.map(item => (
                  <Badge key={item} variant="destructive" className="flex items-center gap-1">
                    {item}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeDontUse(item)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={saveBrandVoice} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
            {hasProfile && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
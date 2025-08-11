import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface BrandVoice {
  id?: string;
  brand_id: string;
  brand_name: string;
  tone: string;
  personality_traits: string[];
  communication_style: string;
  values: string;
  voice_description: string;
  do_use: string[];
  dont_use: string[];
}

interface BrandVoiceManagerProps {
  brandId: string;
}

const toneOptions = [
  "Professional", "Friendly", "Casual", "Authoritative", "Playful", 
  "Sophisticated", "Approachable", "Energetic", "Calm", "Inspiring"
];

const styleOptions = [
  "Direct", "Conversational", "Formal", "Storytelling", "Educational",
  "Humorous", "Empathetic", "Bold", "Minimalist", "Detailed"
];

export function BrandVoiceManager({ brandId }: BrandVoiceManagerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  
  const [formData, setFormData] = useState<BrandVoice>({
    brand_id: brandId,
    brand_name: "",
    tone: "",
    personality_traits: [],
    communication_style: "",
    values: "",
    voice_description: "",
    do_use: [],
    dont_use: []
  });

  const [tempInputs, setTempInputs] = useState({
    trait: "",
    doUse: "",
    dontUse: ""
  });

  useEffect(() => {
    if (user && brandId) {
      fetchBrandVoice();
    }
  }, [user, brandId]);

  const fetchBrandVoice = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brand_voice_profiles')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData(data);
        setHasProfile(true);
        setIsEditing(false);
      } else {
        setHasProfile(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching brand voice:', error);
      toast.error('Failed to load brand voice profile');
    } finally {
      setLoading(false);
    }
  };

  const saveBrandVoice = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('brand_voice_profiles')
        .upsert({
          brand_id: brandId,
          ...formData
        });

      if (error) throw error;

      toast.success('Brand voice profile saved successfully!');
      setHasProfile(true);
      setIsEditing(false);
      await fetchBrandVoice();
    } catch (error) {
      console.error('Error saving brand voice:', error);
      toast.error('Failed to save brand voice profile');
    } finally {
      setSaving(false);
    }
  };

  const addTrait = () => {
    if (tempInputs.trait.trim()) {
      setFormData(prev => ({
        ...prev,
        personality_traits: [...prev.personality_traits, tempInputs.trait.trim()]
      }));
      setTempInputs(prev => ({ ...prev, trait: "" }));
    }
  };

  const removeTrait = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personality_traits: prev.personality_traits.filter((_, i) => i !== index)
    }));
  };

  const addDoUse = () => {
    if (tempInputs.doUse.trim()) {
      setFormData(prev => ({
        ...prev,
        do_use: [...prev.do_use, tempInputs.doUse.trim()]
      }));
      setTempInputs(prev => ({ ...prev, doUse: "" }));
    }
  };

  const removeDoUse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      do_use: prev.do_use.filter((_, i) => i !== index)
    }));
  };

  const addDontUse = () => {
    if (tempInputs.dontUse.trim()) {
      setFormData(prev => ({
        ...prev,
        dont_use: [...prev.dont_use, tempInputs.dontUse.trim()]
      }));
      setTempInputs(prev => ({ ...prev, dontUse: "" }));
    }
  };

  const removeDontUse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dont_use: prev.dont_use.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isEditing && hasProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brand Voice Profile</CardTitle>
          <CardDescription>Your brand's communication style and personality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">TONE</Label>
              <p className="text-lg font-medium">{formData.tone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">COMMUNICATION STYLE</Label>
              <p className="text-lg font-medium">{formData.communication_style}</p>
            </div>
          </div>

          {formData.voice_description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">VOICE DESCRIPTION</Label>
              <p className="mt-1">{formData.voice_description}</p>
            </div>
          )}

          {formData.values && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">BRAND VALUES</Label>
              <p className="mt-1">{formData.values}</p>
            </div>
          )}

          {formData.personality_traits.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">PERSONALITY TRAITS</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.personality_traits.map((trait, index) => (
                  <Badge key={index} variant="secondary">{trait}</Badge>
                ))}
              </div>
            </div>
          )}

          {formData.do_use.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">DO USE</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.do_use.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 border-green-200">{item}</Badge>
                ))}
              </div>
            </div>
          )}

          {formData.dont_use.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">DON'T USE</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.dont_use.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 border-red-200">{item}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setIsEditing(true)} className="w-full">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hasProfile ? "Edit Brand Voice Profile" : "Create Brand Voice Profile"}</CardTitle>
        <CardDescription>Define how this brand communicates with its audience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="communication_style">Communication Style</Label>
            <Select value={formData.communication_style} onValueChange={(value) => setFormData(prev => ({ ...prev, communication_style: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="voice_description">Voice Description</Label>
          <Textarea
            id="voice_description"
            placeholder="Describe how this brand should sound when communicating..."
            value={formData.voice_description}
            onChange={(e) => setFormData(prev => ({ ...prev, voice_description: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="values">Brand Values</Label>
          <Textarea
            id="values"
            placeholder="What does this brand stand for? What are its core values?"
            value={formData.values}
            onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label>Personality Traits</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add a personality trait"
              value={tempInputs.trait}
              onChange={(e) => setTempInputs(prev => ({ ...prev, trait: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addTrait()}
            />
            <Button type="button" onClick={addTrait} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.personality_traits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.personality_traits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {trait}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTrait(index)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Words/Phrases to Use</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add words or phrases to use"
              value={tempInputs.doUse}
              onChange={(e) => setTempInputs(prev => ({ ...prev, doUse: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addDoUse()}
            />
            <Button type="button" onClick={addDoUse} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.do_use.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.do_use.map((item, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-green-50 border-green-200">
                  {item}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeDoUse(index)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Words/Phrases to Avoid</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add words or phrases to avoid"
              value={tempInputs.dontUse}
              onChange={(e) => setTempInputs(prev => ({ ...prev, dontUse: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addDontUse()}
            />
            <Button type="button" onClick={addDontUse} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.dont_use.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.dont_use.map((item, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-red-50 border-red-200">
                  {item}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeDontUse(index)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          {hasProfile && (
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Cancel
            </Button>
          )}
          <Button onClick={saveBrandVoice} disabled={saving} className="flex-1">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Plus, X, Edit, Eye } from "lucide-react";
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
const toneOptions = ["Professional", "Friendly", "Casual", "Authoritative", "Playful", "Empathetic", "Inspiring", "Educational", "Humorous", "Sophisticated"];
const styleOptions = ["Direct and concise", "Conversational", "Storytelling", "Technical", "Simple and clear", "Detailed and thorough", "Question-based", "Action-oriented"];
export function BrandVoiceProfile() {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    brand_name: "",
    tone: "",
    personality_traits: [],
    communication_style: "",
    values: "",
    voice_description: "",
    do_use: [],
    dont_use: []
  });
  const [newTrait, setNewTrait] = useState("");
  const [newDoUse, setNewDoUse] = useState("");
  const [newDontUse, setNewDontUse] = useState("");
  useEffect(() => {
    fetchBrandVoice();
  }, [user]);
  const fetchBrandVoice = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('brand_voice_profiles' as any).select('*').eq('user_id', user.id).maybeSingle();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (data) {
        setBrandVoice({
          brand_name: (data as any).brand_name || "",
          tone: (data as any).tone || "",
          personality_traits: (data as any).personality_traits || [],
          communication_style: (data as any).communication_style || "",
          values: (data as any).values || "",
          voice_description: (data as any).voice_description || "",
          do_use: (data as any).do_use || [],
          dont_use: (data as any).dont_use || []
        });
        setHasProfile(true);
        setIsEditing(false);
      } else {
        setIsEditing(true);
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error fetching brand voice:', error);
      toast({
        title: "Error",
        description: "Failed to load brand voice profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const saveBrandVoice = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const {
        error
      } = await supabase.from('brand_voice_profiles' as any).upsert({
        user_id: user.id,
        ...brandVoice,
        webhook_url: "",
        // Keep for backend use but not exposed in UI
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast({
        title: "Saved!",
        description: "Brand voice profile has been saved successfully"
      });
      setHasProfile(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving brand voice:', error);
      toast({
        title: "Error",
        description: "Failed to save brand voice profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const addTrait = () => {
    if (newTrait.trim() && !brandVoice.personality_traits.includes(newTrait.trim())) {
      setBrandVoice(prev => ({
        ...prev,
        personality_traits: [...prev.personality_traits, newTrait.trim()]
      }));
      setNewTrait("");
    }
  };
  const removeTrait = (trait: string) => {
    setBrandVoice(prev => ({
      ...prev,
      personality_traits: prev.personality_traits.filter(t => t !== trait)
    }));
  };
  const addDoUse = () => {
    if (newDoUse.trim() && !brandVoice.do_use.includes(newDoUse.trim())) {
      setBrandVoice(prev => ({
        ...prev,
        do_use: [...prev.do_use, newDoUse.trim()]
      }));
      setNewDoUse("");
    }
  };
  const removeDoUse = (item: string) => {
    setBrandVoice(prev => ({
      ...prev,
      do_use: prev.do_use.filter(i => i !== item)
    }));
  };
  const addDontUse = () => {
    if (newDontUse.trim() && !brandVoice.dont_use.includes(newDontUse.trim())) {
      setBrandVoice(prev => ({
        ...prev,
        dont_use: [...prev.dont_use, newDontUse.trim()]
      }));
      setNewDontUse("");
    }
  };
  const removeDontUse = (item: string) => {
    setBrandVoice(prev => ({
      ...prev,
      dont_use: prev.dont_use.filter(i => i !== item)
    }));
  };
  if (loading) {
    return <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
  }

  // View mode component
  const BrandVoiceView = () => <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-serif">{brandVoice.brand_name || "Brand Voice Profile"}</CardTitle>
          <p className="text-muted-foreground">Your brand voice profile summary</p>
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Tone</h4>
            <p className="text-muted-foreground">{brandVoice.tone || "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Communication Style</h4>
            <p className="text-muted-foreground">{brandVoice.communication_style || "Not specified"}</p>
          </div>
        </div>

        {brandVoice.personality_traits.length > 0 && <div>
            <h4 className="font-semibold text-foreground mb-2">Personality Traits</h4>
            <div className="flex flex-wrap gap-2">
              {brandVoice.personality_traits.map(trait => <Badge key={trait} variant="secondary">{trait}</Badge>)}
            </div>
          </div>}

        {brandVoice.values && <div>
            <h4 className="font-semibold text-foreground mb-2">Brand Values</h4>
            <p className="text-muted-foreground">{brandVoice.values}</p>
          </div>}

        {brandVoice.voice_description && <div>
            <h4 className="font-semibold text-foreground mb-2">Voice Description</h4>
            <p className="text-muted-foreground">{brandVoice.voice_description}</p>
          </div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandVoice.do_use.length > 0 && <div>
              <h4 className="font-semibold text-foreground mb-2">Words to Use</h4>
              <div className="flex flex-wrap gap-2">
                {brandVoice.do_use.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
              </div>
            </div>}

          {brandVoice.dont_use.length > 0 && <div>
              <h4 className="font-semibold text-foreground mb-2">Words to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {brandVoice.dont_use.map(item => <Badge key={item} variant="destructive">{item}</Badge>)}
              </div>
            </div>}
        </div>
      </CardContent>
    </Card>;

  // Edit mode component  
  const BrandVoiceEdit = () => <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Brand Voice Profile</CardTitle>
        <p className="text-muted-foreground">
          Define your brand's unique personality and tone that will be used across all content generation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="bv-brand-name">Brand Name</Label>
            <Input
              id="bv-brand-name"
              value={brandVoice.brand_name}
              onChange={(e) => setBrandVoice(prev => ({ ...prev, brand_name: e.target.value }))}
              placeholder="Enter your brand name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={brandVoice.tone} onValueChange={value => setBrandVoice(prev => ({
              ...prev,
              tone: value
            }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your brand tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => <SelectItem key={tone} value={tone}>{tone}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Communication Style</Label>
              <Select value={brandVoice.communication_style} onValueChange={value => setBrandVoice(prev => ({
              ...prev,
              communication_style: value
            }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Personality Traits</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newTrait} onChange={e => setNewTrait(e.target.value)} placeholder="Add a personality trait" onKeyPress={e => e.key === 'Enter' && addTrait()} />
              <Button onClick={addTrait} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {brandVoice.personality_traits.map(trait => <Badge key={trait} variant="secondary" className="flex items-center gap-1">
                  {trait}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTrait(trait)} />
                </Badge>)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bv-values">Brand Values</Label>
            <Textarea id="bv-values" value={brandVoice.values} onChange={e => setBrandVoice(prev => ({
            ...prev,
            values: e.target.value
          }))} placeholder="Describe your brand's core values and beliefs" className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bv-voice-description">Voice Description</Label>
            <Textarea id="bv-voice-description" value={brandVoice.voice_description} onChange={e => setBrandVoice(prev => ({
            ...prev,
            voice_description: e.target.value
          }))} placeholder="Describe how your brand sounds and communicates (e.g., 'We speak like a knowledgeable friend who's always ready to help...')" className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Words/Phrases to Use</Label>
              <div className="flex gap-2 mb-2">
                <Input value={newDoUse} onChange={e => setNewDoUse(e.target.value)} placeholder="Add words to use" onKeyPress={e => e.key === 'Enter' && addDoUse()} />
                <Button onClick={addDoUse} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {brandVoice.do_use.map(item => <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeDoUse(item)} />
                  </Badge>)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Words/Phrases to Avoid</Label>
              <div className="flex gap-2 mb-2">
                <Input value={newDontUse} onChange={e => setNewDontUse(e.target.value)} placeholder="Add words to avoid" onKeyPress={e => e.key === 'Enter' && addDontUse()} />
                <Button onClick={addDontUse} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {brandVoice.dont_use.map(item => <Badge key={item} variant="destructive" className="flex items-center gap-1">
                    {item}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeDontUse(item)} />
                  </Badge>)}
              </div>
            </div>
          </div>

        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={saveBrandVoice} disabled={saving} className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Profile
          </Button>
          {hasProfile && <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>}
        </div>
      </CardContent>
    </Card>;
  return <div className="space-y-6">
      {hasProfile && !isEditing ? <BrandVoiceView /> : <BrandVoiceEdit />}
    </div>;
}
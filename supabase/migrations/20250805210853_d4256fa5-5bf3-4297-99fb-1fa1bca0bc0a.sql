-- Create brand_voice_profiles table
CREATE TABLE public.brand_voice_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  brand_name TEXT,
  tone TEXT,
  personality_traits TEXT[],
  communication_style TEXT,
  values TEXT,
  voice_description TEXT,
  do_use TEXT[],
  dont_use TEXT[],
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.brand_voice_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_voice_profiles
CREATE POLICY "Users can view their own brand voice profile" 
ON public.brand_voice_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand voice profile" 
ON public.brand_voice_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand voice profile" 
ON public.brand_voice_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand voice profile" 
ON public.brand_voice_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create target_audience_profiles table
CREATE TABLE public.target_audience_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  niche_description TEXT,
  demographics JSONB,
  psychographics JSONB,
  pain_points TEXT[],
  goals TEXT[],
  preferred_platforms TEXT[],
  content_preferences TEXT[],
  buying_behavior TEXT,
  communication_style TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.target_audience_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for target_audience_profiles
CREATE POLICY "Users can view their own target audience profile" 
ON public.target_audience_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own target audience profile" 
ON public.target_audience_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own target audience profile" 
ON public.target_audience_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own target audience profile" 
ON public.target_audience_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_brand_voice_profiles_updated_at
BEFORE UPDATE ON public.brand_voice_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_target_audience_profiles_updated_at
BEFORE UPDATE ON public.target_audience_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
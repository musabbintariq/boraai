-- Create brands table for agency management
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on brands table
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
CREATE POLICY "Users can view their own brands" 
ON public.brands 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brands" 
ON public.brands 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands" 
ON public.brands 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands" 
ON public.brands 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on brands
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add brand_id column to brand_voice_profiles
ALTER TABLE public.brand_voice_profiles 
ADD COLUMN brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE;

-- Add brand_id column to target_audience_profiles  
ALTER TABLE public.target_audience_profiles
ADD COLUMN brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE;

-- Create function to get user ID from brand ID (for RLS policies)
CREATE OR REPLACE FUNCTION public.get_brand_owner(brand_uuid UUID)
RETURNS UUID AS $$
  SELECT user_id FROM public.brands WHERE id = brand_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update RLS policies for brand_voice_profiles to work with brands
DROP POLICY IF EXISTS "Users can view their own brand voice profile" ON public.brand_voice_profiles;
DROP POLICY IF EXISTS "Users can create their own brand voice profile" ON public.brand_voice_profiles;
DROP POLICY IF EXISTS "Users can update their own brand voice profile" ON public.brand_voice_profiles;
DROP POLICY IF EXISTS "Users can delete their own brand voice profile" ON public.brand_voice_profiles;

CREATE POLICY "Users can view brand voice profiles for their brands" 
ON public.brand_voice_profiles 
FOR SELECT 
USING (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can create brand voice profiles for their brands" 
ON public.brand_voice_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can update brand voice profiles for their brands" 
ON public.brand_voice_profiles 
FOR UPDATE 
USING (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can delete brand voice profiles for their brands" 
ON public.brand_voice_profiles 
FOR DELETE 
USING (auth.uid() = public.get_brand_owner(brand_id));

-- Update RLS policies for target_audience_profiles to work with brands
DROP POLICY IF EXISTS "Users can view their own target audience profile" ON public.target_audience_profiles;
DROP POLICY IF EXISTS "Users can create their own target audience profile" ON public.target_audience_profiles;
DROP POLICY IF EXISTS "Users can update their own target audience profile" ON public.target_audience_profiles;
DROP POLICY IF EXISTS "Users can delete their own target audience profile" ON public.target_audience_profiles;

CREATE POLICY "Users can view target audience profiles for their brands" 
ON public.target_audience_profiles 
FOR SELECT 
USING (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can create target audience profiles for their brands" 
ON public.target_audience_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can update target audience profiles for their brands" 
ON public.target_audience_profiles 
FOR UPDATE 
USING (auth.uid() = public.get_brand_owner(brand_id));

CREATE POLICY "Users can delete target audience profiles for their brands" 
ON public.target_audience_profiles 
FOR DELETE 
USING (auth.uid() = public.get_brand_owner(brand_id));
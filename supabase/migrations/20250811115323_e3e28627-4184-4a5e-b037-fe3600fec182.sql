-- Remove user_id requirement from brand_voice_profiles and target_audience_profiles
-- since they now use brand_id for relationship

-- Make user_id nullable in brand_voice_profiles (it will be deprecated)
ALTER TABLE public.brand_voice_profiles 
ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in target_audience_profiles (it will be deprecated)  
ALTER TABLE public.target_audience_profiles
ALTER COLUMN user_id DROP NOT NULL;

-- Make brand_id not null in brand_voice_profiles
ALTER TABLE public.brand_voice_profiles 
ALTER COLUMN brand_id SET NOT NULL;

-- Make brand_id not null in target_audience_profiles
ALTER TABLE public.target_audience_profiles
ALTER COLUMN brand_id SET NOT NULL;
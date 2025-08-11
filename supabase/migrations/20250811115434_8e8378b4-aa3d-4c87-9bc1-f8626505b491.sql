-- First, remove any existing brand_voice_profiles and target_audience_profiles 
-- that don't have brand_id (they are orphaned from the old system)
DELETE FROM public.brand_voice_profiles WHERE brand_id IS NULL;
DELETE FROM public.target_audience_profiles WHERE brand_id IS NULL;

-- Now make brand_id not null in both tables
ALTER TABLE public.brand_voice_profiles 
ALTER COLUMN brand_id SET NOT NULL;

ALTER TABLE public.target_audience_profiles
ALTER COLUMN brand_id SET NOT NULL;

-- Make user_id nullable since we're moving away from direct user relationships
ALTER TABLE public.brand_voice_profiles 
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.target_audience_profiles
ALTER COLUMN user_id DROP NOT NULL;
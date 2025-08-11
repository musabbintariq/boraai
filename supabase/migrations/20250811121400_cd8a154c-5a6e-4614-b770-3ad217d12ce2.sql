-- Clean up unused columns from brand_voice_profiles table
-- Remove user_id since we now use brand_id for relationships
ALTER TABLE public.brand_voice_profiles 
DROP COLUMN IF EXISTS user_id;

-- Clean up unused columns from target_audience_profiles table  
-- Remove user_id and other unused columns
ALTER TABLE public.target_audience_profiles 
DROP COLUMN IF EXISTS user_id,
DROP COLUMN IF EXISTS buying_behavior,
DROP COLUMN IF EXISTS target_audience_input,
DROP COLUMN IF EXISTS webhook_url;

-- Remove unused columns from brands table if any
-- Keep only essential brand information
-- (Note: Only removing truly unused columns to avoid breaking existing data)
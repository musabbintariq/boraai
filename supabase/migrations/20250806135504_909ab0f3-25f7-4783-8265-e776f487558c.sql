-- Add optional target audience input field to target_audience_profiles table
ALTER TABLE public.target_audience_profiles 
ADD COLUMN target_audience_input TEXT;
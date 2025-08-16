-- Enable real-time for target_audience_profiles table
ALTER TABLE public.target_audience_profiles REPLICA IDENTITY FULL;

-- Add table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.target_audience_profiles;
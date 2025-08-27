-- Enable real-time for brands table
ALTER TABLE public.brands REPLICA IDENTITY FULL;

-- Add brands table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.brands;

-- Enable real-time for content_ideas table
ALTER TABLE public.content_ideas REPLICA IDENTITY FULL;

-- Add content_ideas table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_ideas;

-- Enable real-time for scripts table
ALTER TABLE public.scripts REPLICA IDENTITY FULL;

-- Add scripts table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.scripts;
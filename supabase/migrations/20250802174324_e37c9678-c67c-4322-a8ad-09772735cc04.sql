-- Add plan field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN plan TEXT DEFAULT 'free' NOT NULL;
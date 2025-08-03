-- Create enum for feedback status
CREATE TYPE public.feedback_status_enum AS ENUM ('pending', 'liked', 'disliked');

-- Create the generated_ideas table
CREATE TABLE public.generated_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  feedback_status public.feedback_status_enum NOT NULL DEFAULT 'pending',
  generation_context JSONB,
  content_idea_id UUID REFERENCES public.content_ideas(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_ideas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view their own generated ideas" 
ON public.generated_ideas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated ideas" 
ON public.generated_ideas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated ideas" 
ON public.generated_ideas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated ideas" 
ON public.generated_ideas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_generated_ideas_updated_at
BEFORE UPDATE ON public.generated_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_generated_ideas_user_id ON public.generated_ideas(user_id);
CREATE INDEX idx_generated_ideas_feedback_status ON public.generated_ideas(feedback_status);
CREATE INDEX idx_generated_ideas_created_at ON public.generated_ideas(created_at DESC);
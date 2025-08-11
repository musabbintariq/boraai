-- Add brand_id column to generated_ideas table
ALTER TABLE public.generated_ideas 
ADD COLUMN brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;
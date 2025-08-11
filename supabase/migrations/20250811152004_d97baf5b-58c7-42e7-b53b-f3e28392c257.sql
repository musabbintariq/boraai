-- Add brand_id column to content_ideas table
ALTER TABLE public.content_ideas 
ADD COLUMN brand_id uuid REFERENCES public.brands(brand_id) ON DELETE CASCADE;

-- Add brand_id column to scripts table  
ALTER TABLE public.scripts 
ADD COLUMN brand_id uuid REFERENCES public.brands(brand_id) ON DELETE CASCADE;

-- Update RLS policies for content_ideas to include brand ownership
DROP POLICY "Users can view their own content ideas" ON public.content_ideas;
DROP POLICY "Users can create their own content ideas" ON public.content_ideas;
DROP POLICY "Users can update their own content ideas" ON public.content_ideas;
DROP POLICY "Users can delete their own content ideas" ON public.content_ideas;

CREATE POLICY "Users can view content ideas for their brands" 
ON public.content_ideas 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));

CREATE POLICY "Users can create content ideas for their brands" 
ON public.content_ideas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND (brand_id IS NULL OR auth.uid() = get_brand_owner(brand_id)));

CREATE POLICY "Users can update content ideas for their brands" 
ON public.content_ideas 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));

CREATE POLICY "Users can delete content ideas for their brands" 
ON public.content_ideas 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));

-- Update RLS policies for scripts to include brand ownership
DROP POLICY "Users can view their own scripts" ON public.scripts;
DROP POLICY "Users can create their own scripts" ON public.scripts;
DROP POLICY "Users can update their own scripts" ON public.scripts;
DROP POLICY "Users can delete their own scripts" ON public.scripts;

CREATE POLICY "Users can view scripts for their brands" 
ON public.scripts 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));

CREATE POLICY "Users can create scripts for their brands" 
ON public.scripts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND (brand_id IS NULL OR auth.uid() = get_brand_owner(brand_id)));

CREATE POLICY "Users can update scripts for their brands" 
ON public.scripts 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));

CREATE POLICY "Users can delete scripts for their brands" 
ON public.scripts 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = get_brand_owner(brand_id));
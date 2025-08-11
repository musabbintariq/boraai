-- Fix the foreign key constraint for content_ideas table if it exists
-- First check if there's an existing foreign key constraint causing issues
DO $$
BEGIN
    -- Drop any existing foreign key constraints on brand_id in content_ideas
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'content_ideas' AND column_name = 'brand_id'
    ) THEN
        -- Get the constraint name and drop it
        EXECUTE (
            SELECT 'ALTER TABLE public.content_ideas DROP CONSTRAINT ' || constraint_name || ';'
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'content_ideas' 
            AND kcu.column_name = 'brand_id'
            LIMIT 1
        );
    END IF;
    
    -- Add the correct foreign key constraint
    ALTER TABLE public.content_ideas 
    ADD CONSTRAINT content_ideas_brand_id_fkey 
    FOREIGN KEY (brand_id) REFERENCES public.brands(brand_id) ON DELETE SET NULL;
EXCEPTION
    WHEN others THEN
        -- If constraint already exists correctly, ignore the error
        NULL;
END $$;
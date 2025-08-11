-- Fix security issue with function search path
CREATE OR REPLACE FUNCTION public.get_brand_owner(brand_uuid UUID)
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT user_id FROM public.brands WHERE id = brand_uuid;
$$;
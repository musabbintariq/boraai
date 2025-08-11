-- Fix the get_brand_owner function to use the correct column name
CREATE OR REPLACE FUNCTION public.get_brand_owner(brand_uuid uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT user_id FROM public.brands WHERE brand_id = brand_uuid;
$function$;
CREATE OR REPLACE FUNCTION public.tier_from_count(_count INTEGER)
RETURNS public.loyalty_tier
LANGUAGE sql IMMUTABLE SET search_path = public
AS $$
  SELECT CASE
    WHEN _count >= 15 THEN 'black'::public.loyalty_tier
    WHEN _count >= 5 THEN 'elite'::public.loyalty_tier
    ELSE 'classic'::public.loyalty_tier
  END
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_card_code() FROM PUBLIC, anon, authenticated;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.recalc_customer_loyalty() CASCADE;
DROP FUNCTION IF EXISTS public.generate_customer_code() CASCADE;
DROP FUNCTION IF EXISTS public.touch_updated_at() CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.loyalty_tier CASCADE;
-- Enum de niveles
CREATE TYPE public.loyalty_tier AS ENUM ('classic', 'elite', 'black');

-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabla de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función has_role (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Políticas user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tabla de clientes
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  card_code TEXT NOT NULL UNIQUE,
  purchases_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Función para tier desde count
CREATE OR REPLACE FUNCTION public.tier_from_count(_count INTEGER)
RETURNS public.loyalty_tier
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE
    WHEN _count >= 15 THEN 'black'::public.loyalty_tier
    WHEN _count >= 5 THEN 'elite'::public.loyalty_tier
    ELSE 'classic'::public.loyalty_tier
  END
$$;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generador de card_code (GM-XXXXXX)
CREATE OR REPLACE FUNCTION public.generate_card_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  new_code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    new_code := 'GM-' || lpad(floor(random()*1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.customers WHERE card_code = new_code) INTO exists_code;
    EXIT WHEN NOT exists_code;
  END LOOP;
  RETURN new_code;
END; $$;

CREATE OR REPLACE FUNCTION public.set_card_code()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.card_code IS NULL OR NEW.card_code = '' THEN
    NEW.card_code := public.generate_card_code();
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER set_customer_card_code
  BEFORE INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_card_code();

-- Políticas customers: solo admins
CREATE POLICY "Admins can view customers" ON public.customers
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert customers" ON public.customers
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update customers" ON public.customers
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete customers" ON public.customers
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_customers_full_name ON public.customers (full_name);
CREATE INDEX idx_customers_card_code ON public.customers (card_code);

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.loyalty_tier AS ENUM ('classic', 'elite', 'black');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Generador de código único corto
CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Customers
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT public.generate_customer_code(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  tier loyalty_tier NOT NULL DEFAULT 'classic',
  purchase_count INT NOT NULL DEFAULT 0,
  last_purchase_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Acceso público de SOLO LECTURA por código (la vista del cliente con QR)
CREATE POLICY "Public can view customers (card lookup by code)"
  ON public.customers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage customers"
  ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Purchases
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view purchases (for card history)"
  ON public.purchases FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage purchases"
  ON public.purchases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger: recalcula tier y contador
CREATE OR REPLACE FUNCTION public.recalc_customer_loyalty()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cnt INT;
  last_at TIMESTAMPTZ;
  new_tier loyalty_tier;
BEGIN
  SELECT COUNT(*), MAX(created_at) INTO cnt, last_at
  FROM public.purchases WHERE customer_id = COALESCE(NEW.customer_id, OLD.customer_id);

  IF cnt >= 10 THEN new_tier := 'black';
  ELSIF cnt >= 5 THEN new_tier := 'elite';
  ELSE new_tier := 'classic';
  END IF;

  UPDATE public.customers
  SET purchase_count = cnt,
      last_purchase_at = last_at,
      tier = new_tier,
      updated_at = now()
  WHERE id = COALESCE(NEW.customer_id, OLD.customer_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_purchases_recalc
AFTER INSERT OR DELETE ON public.purchases
FOR EACH ROW EXECUTE FUNCTION public.recalc_customer_loyalty();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_customers_touch
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_customers_code ON public.customers(code);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_purchases_customer ON public.purchases(customer_id, created_at DESC);

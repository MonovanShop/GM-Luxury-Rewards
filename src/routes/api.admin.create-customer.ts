import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const CreateCustomerSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(30),
});

type CustomerRow = {
  id: string;
  code: string;
  full_name: string;
  phone: string;
  tier: "classic" | "elite" | "black";
  purchase_count: number;
  last_purchase_at: string | null;
};

export const Route = createFileRoute("/api/admin/create-customer")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
          return Response.json({ error: "Inicia sesión otra vez para crear clientes." }, { status: 401 });
        }

        const parsed = CreateCustomerSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "Revisa el nombre y teléfono del cliente." }, { status: 400 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const databaseUrl = process.env.SUPABASE_DB_URL;

        if (!supabaseUrl || !publishableKey || !databaseUrl) {
          return Response.json({ error: "El backend no está listo. Intenta de nuevo." }, { status: 500 });
        }

        const authClient = createClient(supabaseUrl, publishableKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: authError } = await authClient.auth.getUser(token);
        const userId = userData.user?.id;

        if (authError || !userId) {
          return Response.json({ error: "Tu sesión expiró. Vuelve a entrar." }, { status: 401 });
        }

        const { default: postgres } = await import("postgres");
        const sql = postgres(databaseUrl, { max: 1, idle_timeout: 5, connect_timeout: 10, ssl: "require" });

        try {
          const roles = await sql<{ is_admin: boolean }[]>`
            select public.has_role(${userId}::uuid, 'admin'::public.app_role) as is_admin
          `;

          if (!roles[0]?.is_admin) {
            return Response.json({ error: "No tienes permiso para crear clientes." }, { status: 403 });
          }

          const rows = await sql<CustomerRow[]>`
            insert into public.customers (full_name, phone)
            values (${parsed.data.full_name}, ${parsed.data.phone})
            returning id, code, full_name, phone, tier, purchase_count, last_purchase_at
          `;

          return Response.json({ customer: rows[0] }, { status: 201 });
        } catch (error) {
          console.error("create-customer failed", error);
          return Response.json({ error: "No se pudo registrar el cliente. Intenta de nuevo." }, { status: 500 });
        } finally {
          await sql.end({ timeout: 1 });
        }
      },
    },
  },
});
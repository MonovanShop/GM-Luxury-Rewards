import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

type AdminCheck = "loading" | "anon" | "not-admin" | "ok";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel admin · GM Luxury" },
      { name: "description", content: "Gestión de clientes y tarjetas de lealtad GM Luxury." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [state, setState] = useState<AdminCheck>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!active) return;
      if (!user) {
        setState("anon");
        return;
      }
      setEmail(user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (!active) return;
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      setState(isAdmin ? "ok" : "not-admin");
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === "loading") {
    return <CenterShell>Verificando acceso…</CenterShell>;
  }

  if (state === "anon") {
    return <LoginPanel onSuccess={() => router.invalidate()} />;
  }

  if (state === "not-admin") {
    return (
      <CenterShell>
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl text-gradient-gold">Acceso restringido</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tu cuenta {email ? <strong>({email})</strong> : null} no tiene permisos de administrador.
            Pídele a un administrador que te asigne el rol.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </CenterShell>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-lg text-gradient-gold">GM Luxury</p>
              <p className="text-[10px] tracking-[0.4em] text-muted-foreground">ADMIN</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/admin" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

function CenterShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      {children}
    </div>
  );
}

function LoginPanel({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      onSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error inesperado";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border/70 bg-card/60 p-7 shadow-luxury"
      >
        <p className="font-display text-2xl text-gradient-gold">Panel admin</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === "signin" ? "Inicia sesión para gestionar clientes." : "Crea tu cuenta admin."}
        </p>

        <label className="mt-6 block text-xs uppercase tracking-widest text-muted-foreground">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
        />

        <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
          Contraseña
        </label>
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
        />

        {error ? (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        ) : null}

        <Button type="submit" disabled={loading} className="mt-5 w-full">
          {loading ? "Procesando…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-gold"
        >
          {mode === "signin" ? "¿No tienes cuenta? Crear cuenta" : "Ya tengo cuenta, iniciar sesión"}
        </button>

        <p className="mt-5 text-[10px] leading-4 text-muted-foreground">
          Tras crear tu cuenta, un administrador debe asignarte el rol <code>admin</code> en la
          tabla <code>user_roles</code>. El primer admin se crea ahí mismo.
        </p>
      </form>
    </div>
  );
}

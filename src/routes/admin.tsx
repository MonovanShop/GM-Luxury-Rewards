import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.navigate({ to: "/admin/login" });
        return;
      }
      setEmail(data.session.user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roles);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.navigate({ to: "/admin/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login" });
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center gold-border">
          <Sparkles className="w-10 h-10 text-gold mx-auto mb-4" />
          <h1 className="font-display text-2xl text-gradient-gold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Tu cuenta no tiene permisos de administrador. Contacta al propietario para que te asigne el rol de admin.
          </p>
          <Button onClick={logout} variant="outline">Cerrar sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <div>
              <div className="font-display text-lg text-gradient-gold leading-none">GM Luxury</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">REWARDS · ADMIN</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/admin" activeOptions={{ exact: true }}
              className="px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-muted/50 [&.active]:text-gold [&.active]:bg-muted/40"
              activeProps={{ className: "active" }}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/admin/customers"
              className="px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-muted/50 [&.active]:text-gold [&.active]:bg-muted/40"
              activeProps={{ className: "active" }}>
              <Users className="w-4 h-4" /> Clientes
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">{email}</span>
            <Button onClick={logout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

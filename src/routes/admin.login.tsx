import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.navigate({ to: "/admin" });
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Pídele al propietario que te asigne rol de admin.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido");
        router.navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md fade-in-up">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold-glow">
            <Sparkles className="w-5 h-5 text-background" />
          </div>
          <div className="text-center">
            <div className="font-display text-2xl text-gradient-gold leading-none">GM Luxury</div>
            <div className="text-[10px] tracking-[0.4em] text-muted-foreground mt-1">REWARDS</div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-8 gold-border shadow-luxury">
          <h1 className="font-display text-3xl text-center text-gradient-gold mb-1">
            {mode === "login" ? "Acceso administrador" : "Crear cuenta"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Panel exclusivo para el equipo GM Luxury
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmluxury.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-background hover:opacity-90 font-medium">
              {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Registrarme"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-muted-foreground hover:text-gold transition">
              {mode === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Después del primer registro debes asignarte rol de administrador desde la base de datos.
        </p>
      </div>
    </div>
  );
}

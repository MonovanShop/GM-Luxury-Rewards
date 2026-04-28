import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { TIER_INFO, nextTierProgress, type Tier } from "@/lib/loyalty";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, Check, Crown } from "lucide-react";

export const Route = createFileRoute("/loyalty/$code")({
  component: CustomerView,
});

const STORAGE_KEY = "gm_luxury_card_code";

type CustomerData = {
  id: string; code: string; full_name: string;
  tier: Tier; purchase_count: number; last_purchase_at: string | null;
};
type Purchase = { id: string; description: string | null; created_at: string };

function CustomerView() {
  const { code } = Route.useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: c } = await supabase.from("customers")
        .select("id,code,full_name,tier,purchase_count,last_purchase_at")
        .eq("code", code.toUpperCase()).maybeSingle();
      if (!c) { setNotFound(true); setLoading(false); return; }
      setCustomer(c as CustomerData);
      // Persist session
      try { localStorage.setItem(STORAGE_KEY, c.code); } catch {}
      const { data: p } = await supabase.from("purchases")
        .select("id,description,created_at")
        .eq("customer_id", c.id).order("created_at", { ascending: false }).limit(20);
      setPurchases((p ?? []) as Purchase[]);
      setLoading(false);
    };
    load();
  }, [code]);

  const logout = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    router.navigate({ to: "/" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando tu tarjeta...</div>;
  }

  if (notFound || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center gold-border">
          <h1 className="font-display text-2xl text-gradient-gold mb-2">Tarjeta no encontrada</h1>
          <p className="text-muted-foreground text-sm mb-6">
            El código <span className="font-mono">{code}</span> no corresponde a ninguna tarjeta activa.
          </p>
          <Button onClick={() => router.navigate({ to: "/" })} variant="outline">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const info = TIER_INFO[customer.tier];
  const progress = nextTierProgress(customer.purchase_count);
  const progressPct = progress.next
    ? Math.min(100, (customer.purchase_count / progress.target) * 100)
    : 100;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <div>
              <div className="font-display text-lg text-gradient-gold leading-none">GM Luxury</div>
              <div className="text-[10px] tracking-[0.4em] text-muted-foreground">REWARDS</div>
            </div>
          </div>
          <Button onClick={logout} variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Salir
          </Button>
        </header>

        {/* Welcome */}
        <div className="text-center pt-4">
          <p className="text-xs tracking-[0.4em] text-muted-foreground">BIENVENIDO</p>
          <h1 className="font-display text-3xl sm:text-4xl text-gradient-gold mt-2">
            {customer.full_name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto italic">
            Tu fidelidad merece beneficios exclusivos.
          </p>
        </div>

        {/* Card */}
        <div className="flex justify-center py-2">
          <LoyaltyCard tier={customer.tier} fullName={customer.full_name}
            code={customer.code} purchaseCount={customer.purchase_count} />
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-6 gold-border">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="text-[10px] tracking-[0.4em] text-muted-foreground">NIVEL ACTUAL</div>
              <div className="font-display text-2xl text-gradient-gold">{info.name}</div>
            </div>
            {customer.tier === "black" && <Crown className="w-7 h-7 text-gold" />}
          </div>
          <p className="text-sm text-muted-foreground">{info.tagline}</p>

          <div className="mt-5">
            {progress.next ? (
              <>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">
                    Faltan <span className="text-gold font-medium">{progress.needed}</span> compras para {progress.next}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {customer.purchase_count} / {progress.target}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-gold transition-all duration-700"
                    style={{ width: `${progressPct}%` }} />
                </div>
              </>
            ) : (
              <div className="text-center py-3">
                <div className="text-gold text-sm">✦ Has alcanzado el nivel máximo ✦</div>
              </div>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl text-gradient-gold mb-4">Tus beneficios</h3>
          <ul className="space-y-3">
            {info.benefits.map(b => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-background" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* History */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-gradient-gold">Historial</h3>
            <span className="text-xs text-muted-foreground">{purchases.length} compras recientes</span>
          </div>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay compras registradas.</p>
          ) : (
            <ul className="divide-y divide-border/40 -mx-2">
              {purchases.map(p => (
                <li key={p.id} className="px-2 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm truncate">{p.description || "Compra registrada"}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <div className="text-gold text-xs">✦</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="text-center pt-4 pb-8">
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground">GM LUXURY · BRANDS HUB</p>
        </footer>
      </div>
    </div>
  );
}

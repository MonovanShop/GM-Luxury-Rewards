import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TIER_INFO } from "@/lib/loyalty";
import { Crown, Users, ShoppingBag, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, classic: 0, elite: 0, black: 0, purchases: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ data: customers }, { count: pCount }] = await Promise.all([
        supabase.from("customers").select("tier"),
        supabase.from("purchases").select("*", { count: "exact", head: true }),
      ]);
      const c = customers ?? [];
      setStats({
        total: c.length,
        classic: c.filter(x => x.tier === "classic").length,
        elite: c.filter(x => x.tier === "elite").length,
        black: c.filter(x => x.tier === "black").length,
        purchases: pCount ?? 0,
      });
    };
    load();
  }, []);

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="font-display text-4xl text-gradient-gold">Panel general</h1>
        <p className="text-muted-foreground mt-1">Control total de tu programa de fidelidad</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Clientes totales" value={stats.total} />
        <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Compras registradas" value={stats.purchases} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Clientes Elite" value={stats.elite} />
        <StatCard icon={<Crown className="w-5 h-5" />} label="Clientes Black" value={stats.black} highlight />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(["classic","elite","black"] as const).map(t => {
          const info = TIER_INFO[t];
          const count = stats[t];
          return (
            <div key={t} className="glass rounded-2xl p-6 gold-border">
              <div className="text-[10px] tracking-[0.4em] text-muted-foreground">{info.label}</div>
              <div className="font-display text-2xl text-gradient-gold mt-1">{info.name}</div>
              <div className="text-4xl font-display mt-4 text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground">clientes en este nivel</div>
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="text-xs text-muted-foreground">Beneficio principal</div>
                <div className="text-sm text-foreground mt-1">{info.discount} de descuento</div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/admin/customers"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-gold text-background font-medium hover:opacity-90 transition">
        Ir a clientes →
      </Link>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`glass rounded-xl p-5 ${highlight ? "shadow-gold-glow" : ""}`}>
      <div className="flex items-center justify-between text-muted-foreground mb-3">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        <span className={highlight ? "text-gold" : ""}>{icon}</span>
      </div>
      <div className="font-display text-3xl text-foreground">{value}</div>
    </div>
  );
}

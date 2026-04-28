import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ScanLine, KeyRound } from "lucide-react";
import { TIER_INFO } from "@/lib/loyalty";

export const Route = createFileRoute("/")({
  component: Landing,
});

const STORAGE_KEY = "gm_luxury_card_code";

function Landing() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [hasSession, setHasSession] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHasSession(saved);
    } catch {}
  }, []);

  const open = (c: string) => {
    if (!c.trim()) return;
    router.navigate({ to: "/loyalty/$code", params: { code: c.trim().toUpperCase() } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.78 0.12 85 / 0.3), transparent 60%)" }} />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 gold-border">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-[10px] tracking-[0.4em] text-gold-soft">GM LUXURY · REWARDS</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-gradient-gold leading-[1.05]">
            Programa de Fidelidad
          </h1>
          <h2 className="font-display text-3xl sm:text-5xl text-foreground/90 italic mt-2">
            para clientes distinguidos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-6 text-sm sm:text-base">
            Louis Vuitton · Dior · Gucci · Balenciaga · Prada · Valentino · Balmain · Dolce &amp; Gabbana.
            Cada compra te acerca a beneficios reservados para una élite.
          </p>

          {/* Access card */}
          <div className="mt-12 max-w-md mx-auto glass rounded-2xl p-6 sm:p-8 gold-border shadow-luxury">
            {hasSession ? (
              <>
                <p className="text-xs tracking-[0.3em] text-muted-foreground mb-2">SESIÓN GUARDADA</p>
                <p className="font-display text-2xl text-gradient-gold mb-4">Bienvenido de vuelta</p>
                <Button onClick={() => open(hasSession)}
                  className="w-full bg-gradient-gold text-background font-medium">
                  Abrir mi tarjeta ({hasSession})
                </Button>
                <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setHasSession(null); }}
                  className="text-xs text-muted-foreground hover:text-gold mt-3">
                  Usar otra tarjeta
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-gold mb-3">
                  <ScanLine className="w-5 h-5" />
                  <span className="text-xs tracking-[0.3em]">ACCEDE A TU TARJETA</span>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Escanea tu código QR o ingresa el código de tu tarjeta.
                </p>
                <form onSubmit={e => { e.preventDefault(); open(code); }} className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO" className="pl-9 font-mono tracking-widest uppercase" maxLength={10} />
                  </div>
                  <Button type="submit" className="bg-gradient-gold text-background">Abrir</Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground">NUESTROS NIVELES</p>
          <h3 className="font-display text-3xl sm:text-4xl text-gradient-gold mt-2">
            Tres formas de pertenecer
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(["classic","elite","black"] as const).map((t, i) => {
            const info = TIER_INFO[t];
            const bg = t === "black" ? "tier-black-bg" : t === "elite" ? "tier-elite-bg" : "tier-classic-bg";
            return (
              <div key={t}
                className={`relative rounded-2xl p-6 gold-border shadow-card-lux ${bg} fade-in-up`}
                style={{ animationDelay: `${i * 120}ms` }}>
                <div className="text-[10px] tracking-[0.4em] text-gold-soft/80">{info.label}</div>
                <div className="font-display text-2xl text-gradient-gold mt-1">{info.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {info.max ? `${info.min} a ${info.max} compras` : `${info.min}+ compras`}
                </div>
                <div className="mt-5 font-display text-4xl text-gradient-gold">{info.discount}</div>
                <div className="text-xs text-muted-foreground">de descuento</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {info.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">✦</span>
                      <span className="text-foreground/80">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
}

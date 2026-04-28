import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ScanLine, KeyRound } from "lucide-react";
import { TIER_INFO } from "@/lib/loyalty";

export const Route = createFileRoute("/")({
  component: Landing,
});

const STORAGE_KEY = "gm_luxury_card_code";

function Landing() {
  const [hasSession, setHasSession] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHasSession(saved);
    } catch {}
  }, []);

  const open = useCallback((c: string) => {
    const trimmed = c.trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed === "ADM" || trimmed === "ADMIN") {
      window.location.assign("/admin/login");
      return;
    }
    window.location.assign(`/loyalty/${encodeURIComponent(trimmed)}`);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSession(null);
  }, []);

  return (
    <div className="min-h-screen">
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

          <AccessCard hasSession={hasSession} onOpen={open} onClearSession={clearSession} />
        </div>
      </section>

      <TiersSection />
    </div>
  );
}

const AccessCard = memo(function AccessCard({
  hasSession, onOpen, onClearSession,
}: { hasSession: string | null; onOpen: (c: string) => void; onClearSession: () => void }) {
  return (
    <div className="mt-12 max-w-md mx-auto glass rounded-2xl p-6 sm:p-8 gold-border shadow-luxury">
      <CodeForm onOpen={onOpen} />
      {hasSession && (
        <div className="mt-6 border-t border-gold/20 pt-5">
          <p className="text-xs tracking-[0.3em] text-muted-foreground mb-2">SESIÓN GUARDADA</p>
          <p className="font-display text-2xl text-gradient-gold mb-4">También puedes volver directo</p>
          <Button onClick={() => onOpen(hasSession)}
            className="w-full bg-gradient-gold text-background font-medium">
            Abrir mi tarjeta ({hasSession})
          </Button>
          <button onClick={onClearSession}
            className="text-xs text-muted-foreground hover:text-gold mt-3">
            Borrar sesión guardada
          </button>
        </div>
      )}
    </div>
  );
});

function CodeForm({ onOpen }: { onOpen: (c: string) => void }) {
  const submitCode = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onOpen(String(data.get("code") ?? ""));
  }, [onOpen]);

  return (
    <>
      <div className="flex items-center justify-center gap-2 text-gold mb-3">
        <ScanLine className="w-5 h-5" />
        <span className="text-xs tracking-[0.3em]">ACCEDE A TU TARJETA</span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Escanea tu código QR o ingresa el código de tu tarjeta.
      </p>
      <form onSubmit={submitCode} className="flex gap-2">
        <div className="relative flex-1">
          <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="code"
            placeholder="CÓDIGO"
            className="flex h-11 w-full rounded-md border border-input bg-background/70 px-3 py-2 pl-9 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold focus:ring-1 focus:ring-gold font-mono tracking-widest"
            maxLength={10}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
          />
        </div>
        <Button type="submit" className="bg-gradient-gold text-background">Abrir</Button>
      </form>
    </>
  );
}

const TiersSection = memo(function TiersSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground">NUESTROS NIVELES</p>
        <h3 className="font-display text-3xl sm:text-4xl text-gradient-gold mt-2">
          Tres formas de pertenecer
        </h3>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {(["classic","elite","black"] as const).map((t) => {
          const info = TIER_INFO[t];
          const bg = t === "black" ? "tier-black-bg" : t === "elite" ? "tier-elite-bg" : "tier-classic-bg";
          return (
            <div key={t}
              className={`relative rounded-2xl p-6 gold-border shadow-card-lux ${bg}`}>
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
  );
});

import { createFileRoute } from "@tanstack/react-router";
import { Award, Crown, Gem, ShieldCheck, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GM Luxury Rewards Card" },
      {
        name: "description",
        content: "Presentación premium de tarjeta de lealtad GM Luxury sin formularios ni lógica antigua.",
      },
      { property: "og:title", content: "GM Luxury Rewards Card" },
      {
        property: "og:description",
        content: "Tarjeta de lealtad premium para clientes distinguidos de GM Luxury.",
      },
    ],
  }),
  component: LoyaltyPresentation,
});

function LoyaltyPresentation() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.88_0.10_85/.20),transparent_30%),linear-gradient(145deg,oklch(0.10_0.005_60),oklch(0.16_0.015_72)_48%,oklch(0.08_0.005_60))]" />
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold shadow-gold-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-gradient-gold">GM Luxury</p>
                <p className="mt-1 text-[10px] tracking-[0.42em] text-muted-foreground">REWARDS CARD</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Luxury Brands Hub</span>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="max-w-xl fade-in-up">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gold-soft">Programa de lealtad</p>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] text-gradient-gold sm:text-7xl lg:text-8xl">
                Tarjeta de cliente distinguido
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                Una presentación limpia para mostrar el concepto de membresía, beneficios por nivel y experiencia premium para clientes GM Luxury.
              </p>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
                <MiniStat value="3" label="niveles" />
                <MiniStat value="10%" label="beneficio" />
                <MiniStat value="VIP" label="estatus" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] fade-in-up lg:ml-auto">
              <LuxuryCard />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <TierPill icon={<Star className="h-4 w-4" />} title="Classic" text="Entrada premium" />
                <TierPill icon={<Gem className="h-4 w-4" />} title="Elite" text="Acceso superior" />
                <TierPill icon={<Crown className="h-4 w-4" />} title="Black" text="Máximo estatus" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-muted-foreground">Beneficios</p>
            <h2 className="mt-3 font-display text-4xl text-gradient-gold sm:text-5xl">Diseñada para recompensar compras recurrentes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Benefit title="Descuentos por nivel" text="Classic, Elite y Black comunican progreso de forma clara." />
            <Benefit title="QR listo para compartir" text="La tarjeta puede convertirse en enlace o QR para cada cliente." />
            <Benefit title="Presentación premium" text="Estética de lujo enfocada en marcas y clientes distinguidos." />
          </div>
        </div>
      </section>
    </div>
  );
}

function LuxuryCard() {
  return (
    <article className="relative aspect-[1.58/1] w-full overflow-hidden rounded-[28px] border border-gold/30 bg-[linear-gradient(135deg,oklch(0.18_0.014_66),oklch(0.08_0.006_60)_52%,oklch(0.28_0.05_82))] p-6 shadow-luxury sm:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,oklch(1_0_0/.10)_48%,transparent_63%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gold-soft">GM Luxury</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold sm:text-5xl">Black Rewards</p>
          </div>
          <Award className="h-9 w-9 text-gold" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground">Member</p>
          <p className="mt-2 font-display text-3xl text-foreground sm:text-4xl">Valued Client</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Card code</p>
            <p className="mt-1 font-mono text-lg tracking-[0.22em] text-gold-soft sm:text-2xl">GM-0001</p>
          </div>
          <div className="rounded-xl border border-gold/30 px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Benefit</p>
            <p className="font-display text-2xl text-gradient-gold">VIP</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-border/70 bg-card/40 p-4">
      <p className="font-display text-3xl text-gradient-gold">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
    </div>
  );
}

function TierPill({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border border-border/70 bg-card/60 p-4">
      <div className="flex items-center gap-2 text-gold">
        {icon}
        <p className="font-medium text-foreground">{title}</p>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-border/70 bg-background/40 p-5">
      <p className="font-display text-2xl text-gradient-gold">{title}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

import { TIER_INFO, type Tier } from "@/lib/loyalty";

interface LoyaltyCardProps {
  tier: Tier;
  fullName: string;
  code: string;
  purchaseCount: number;
  className?: string;
}

export function LoyaltyCard({ tier, fullName, code, purchaseCount, className = "" }: LoyaltyCardProps) {
  const info = TIER_INFO[tier];

  const tierBg =
    tier === "black" ? "tier-black-bg" : tier === "elite" ? "tier-elite-bg" : "tier-classic-bg";

  return (
    <div
      className={`relative aspect-[1.586/1] w-full max-w-md rounded-2xl overflow-hidden shadow-luxury gold-border shimmer ${tierBg} ${className}`}
    >
      {/* texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />

      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-gold-soft/80 font-medium">
              GM LUXURY
            </div>
            <div className="font-display text-2xl text-gradient-gold leading-none mt-1">
              Rewards
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] tracking-[0.3em] text-foreground/50">TIER</div>
            <div className="font-display text-xl text-gradient-gold tracking-wider">
              {info.label}
            </div>
          </div>
        </div>

        {/* Middle decorative line */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[9px] tracking-[0.3em] text-foreground/50 mb-1">CARDHOLDER</div>
            <div className="font-display text-xl text-foreground truncate">{fullName}</div>
            <div className="text-[10px] tracking-[0.25em] text-foreground/40 mt-1 font-mono">
              {code}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[9px] tracking-[0.3em] text-foreground/50">PURCHASES</div>
            <div className="font-display text-3xl text-gradient-gold leading-none">
              {String(purchaseCount).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type Tier = "classic" | "elite" | "black";

export const TIERS: { id: Tier; label: string; min: number; next: number | null }[] = [
  { id: "classic", label: "Classic", min: 0, next: 5 },
  { id: "elite", label: "Elite", min: 5, next: 15 },
  { id: "black", label: "Black", min: 15, next: null },
];

export function tierFromCount(count: number): Tier {
  if (count >= 15) return "black";
  if (count >= 5) return "elite";
  return "classic";
}

export function tierMeta(tier: Tier) {
  return TIERS.find((t) => t.id === tier)!;
}

export function progressToNext(count: number) {
  const tier = tierFromCount(count);
  const meta = tierMeta(tier);
  if (meta.next === null) return { percent: 100, remaining: 0, nextLabel: null as string | null };
  const span = meta.next - meta.min;
  const done = count - meta.min;
  return {
    percent: Math.min(100, Math.round((done / span) * 100)),
    remaining: Math.max(0, meta.next - count),
    nextLabel: meta.next === 5 ? "Elite" : "Black",
  };
}

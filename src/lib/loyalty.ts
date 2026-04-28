export type Tier = "classic" | "elite" | "black";

export const TIER_INFO: Record<Tier, {
  name: string;
  label: string;
  min: number;
  max: number | null;
  discount: string;
  benefits: string[];
  tagline: string;
}> = {
  classic: {
    name: "GM Classic",
    label: "CLASSIC",
    min: 1,
    max: 4,
    discount: "5%",
    benefits: ["5% de descuento al completar 4 compras"],
    tagline: "El inicio de tu experiencia GM Luxury",
  },
  elite: {
    name: "GM Elite",
    label: "ELITE",
    min: 5,
    max: 9,
    discount: "10%",
    benefits: [
      "10% de descuento permanente",
      "Acceso anticipado a nuevos productos",
      "Prioridad en apartados",
    ],
    tagline: "Privilegios exclusivos para clientes distinguidos",
  },
  black: {
    name: "GM Black",
    label: "BLACK",
    min: 10,
    max: null,
    discount: "15%",
    benefits: [
      "15% de descuento permanente",
      "Atención VIP personalizada",
      "Acceso a piezas exclusivas",
      "Envío preferencial",
    ],
    tagline: "Lo más alto. Para una élite que exige lo extraordinario.",
  },
};

export function tierForCount(count: number): Tier {
  if (count >= 10) return "black";
  if (count >= 5) return "elite";
  return "classic";
}

export function nextTierProgress(count: number) {
  if (count < 5) {
    return { next: "GM Elite", needed: 5 - count, target: 5 };
  }
  if (count < 10) {
    return { next: "GM Black", needed: 10 - count, target: 10 };
  }
  return { next: null, needed: 0, target: count };
}

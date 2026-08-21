export function formatFees(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L / yr`;
  }
  return `₹${amount.toLocaleString("en-IN")} / yr`;
}

export function formatPackage(lpa: number): string {
  return `₹${lpa} LPA`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(" ");
}

export const ACCENT_PALETTE = [
  { bg: "bg-forest-tint", text: "text-forest", ring: "ring-forest/20" },
  { bg: "bg-brass/10", text: "text-brass-dark", ring: "ring-brass/20" },
  { bg: "bg-clay-tint", text: "text-clay", ring: "ring-clay/20" },
  { bg: "bg-ink/5", text: "text-ink-soft", ring: "ring-ink/10" },
  { bg: "bg-forest-tint", text: "text-forest-light", ring: "ring-forest/20" },
  { bg: "bg-brass/10", text: "text-brass", ring: "ring-brass/20" },
];

export function initials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 2 || /[A-Z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

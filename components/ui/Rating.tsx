import { formatRating } from "@/lib/utils";

interface RatingProps {
  value: number;
  totalReviews?: number;
  size?: "sm" | "md";
}

export default function Rating({ value, totalReviews, size = "sm" }: RatingProps) {
  const textSize = size === "md" ? "text-base" : "text-sm";
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rated ${formatRating(value)} out of 5`}>
      <span className={`flex items-center gap-1 font-mono font-medium text-ink ${textSize}`}>
        <StarIcon />
        {formatRating(value)}
      </span>
      {totalReviews !== undefined && (
        <span className="text-xs text-ink-faint">({totalReviews.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-brass" aria-hidden="true">
      <path d="M10 1.5l2.59 5.62 6.16.62-4.63 4.19 1.32 6.07L10 14.98l-5.44 3.02 1.32-6.07L1.25 7.74l6.16-.62L10 1.5z" />
    </svg>
  );
}

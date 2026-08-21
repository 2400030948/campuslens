import { Review } from "@/lib/data/types";
import Rating from "@/components/ui/Rating";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border-b border-line py-5 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{review.title}</p>
          <p className="mt-0.5 text-xs text-ink-faint">
            {review.author} &middot; {review.course} &middot; {date}
          </p>
        </div>
        <Rating value={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{review.body}</p>
    </div>
  );
}

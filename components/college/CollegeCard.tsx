import Link from "next/link";
import { College } from "@/lib/data/types";
import { formatFees, formatPackage } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import CollegeMark from "./CollegeMark";
import { LinkButton } from "@/components/ui/Button";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  return (
    <article className="group flex flex-col rounded border border-line bg-paper-raised p-5 transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <CollegeMark name={college.shortName} accentIndex={college.accentIndex} />
        <Rating value={college.rating} totalReviews={college.totalReviews} />
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
        <Link href={`/colleges/${college.slug}`} className="hover:underline">
          {college.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-ink-faint">
        {college.city}, {college.state} &middot; {college.type}
      </p>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {college.description}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="eyebrow">Fees</dt>
          <dd className="mt-0.5 font-mono text-ink">{formatFees(college.annualFees)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Avg. package</dt>
          <dd className="mt-0.5 font-mono text-ink">{formatPackage(college.averagePackage)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {college.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-5 flex gap-2 border-t border-line pt-4">
        <LinkButton href={`/colleges/${college.slug}`} variant="primary" size="sm" className="flex-1">
          View details
        </LinkButton>
        <LinkButton
          href={`/compare?ids=${college.id}`}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Compare
        </LinkButton>
      </div>
    </article>
  );
}

import { College } from "@/lib/data/types";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import CollegeMark from "./CollegeMark";
import { Button, LinkButton } from "@/components/ui/Button";

interface CollegeHeaderProps {
  college: College;
}

export default function CollegeHeader({ college }: CollegeHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <CollegeMark name={college.shortName} accentIndex={college.accentIndex} size="lg" />
        <div>
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {college.name}
          </h1>
          <p className="mt-1.5 text-sm text-ink-faint">
            {college.city}, {college.state} &middot; {college.type} &middot; Est. {college.established}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={college.rating} totalReviews={college.totalReviews} size="md" />
            <div className="flex flex-wrap gap-1.5">
              {college.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} tone="forest">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" aria-label="Save this college">
          Save
        </Button>
        <LinkButton href={`/compare?ids=${college.id}`} variant="primary" size="sm">
          Add to compare
        </LinkButton>
      </div>
    </div>
  );
}

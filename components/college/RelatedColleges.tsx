import { College } from "@/lib/data/types";
import CollegeCard from "./CollegeCard";

interface RelatedCollegesProps {
  colleges: College[];
}

export default function RelatedColleges({ colleges }: RelatedCollegesProps) {
  if (colleges.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-xl font-semibold text-ink">
        Related colleges
      </h2>
      <p className="mt-1 text-sm text-ink-faint">
        Similar in location, type, or program focus.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
      </div>
    </section>
  );
}

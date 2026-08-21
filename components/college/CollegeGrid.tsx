import { College } from "@/lib/data/types";
import CollegeCard from "./CollegeCard";

interface CollegeGridProps {
  colleges: College[];
}

export default function CollegeGrid({ colleges }: CollegeGridProps) {
  if (colleges.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-line-strong px-6 py-20 text-center">
      <p className="font-display text-lg font-medium text-ink">No colleges match those filters</p>
      <p className="mt-2 max-w-sm text-sm text-ink-faint">
        Try widening your fee range, clearing a filter, or searching a different location or course.
      </p>
    </div>
  );
}

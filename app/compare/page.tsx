import { Suspense } from "react";
import { getColleges, getCollegeById } from "@/lib/queries";
import CollegeSelector from "@/components/comparison/CollegeSelector";
import ComparisonTable from "@/components/comparison/ComparisonTable";
import { LinkButton } from "@/components/ui/Button";

interface ComparePageProps {
  searchParams: { ids?: string };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const ids = (searchParams.ids ?? "").split(",").filter(Boolean);
  const allColleges = await getColleges();
  const selected = (
    await Promise.all(ids.map((id) => getCollegeById(id)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow mb-3">Compare</p>
      <h1 className="font-display text-3xl font-semibold text-ink">Line them up side by side</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-faint">
        Choose two or three colleges to compare fees, ratings, placements, and courses in one view.
      </p>

      <div className="mt-8">
        <Suspense fallback={<div className="h-40 rounded border border-line bg-paper-raised" />}>
          <CollegeSelector allColleges={allColleges} selectedIds={ids} />
        </Suspense>
      </div>

      <div className="mt-8">
        {selected.length >= 2 ? (
          <ComparisonTable colleges={selected} />
        ) : (
          <EmptyState hasOne={selected.length === 1} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasOne }: { hasOne: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-line-strong px-6 py-20 text-center">
      <p className="font-display text-lg font-medium text-ink">
        {hasOne ? "Add one more college to compare" : "Select at least two colleges"}
      </p>
      <p className="mt-2 max-w-sm text-sm text-ink-faint">
        Use the selectors above, or browse colleges and use their &ldquo;Compare&rdquo; action.
      </p>
      <div className="mt-6">
        <LinkButton href="/colleges" variant="outline" size="sm">
          Browse colleges
        </LinkButton>
      </div>
    </div>
  );
}

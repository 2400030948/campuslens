import Skeleton, { CollegeCardSkeleton } from "@/components/ui/Skeleton";

export default function CollegesLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-9 w-64" />
        <Skeleton className="mt-6 h-11 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <Skeleton className="h-80 rounded border border-line" />
        </aside>
        <div>
          <Skeleton className="mb-5 h-5 w-40" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

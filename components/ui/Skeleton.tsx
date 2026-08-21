import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-line/60", className)} />;
}

export function CollegeCardSkeleton() {
  return (
    <div className="rounded border border-line bg-paper-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-11 w-11 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-3.5 w-1/2" />
      <Skeleton className="mt-4 h-3.5 w-full" />
      <Skeleton className="mt-1.5 h-3.5 w-5/6" />
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="mt-5 flex gap-2 border-t border-line pt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  );
}

import { Suspense } from "react";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/search/FilterPanel";
import SortSelect from "@/components/search/SortSelect";
import Pagination from "@/components/search/Pagination";
import CollegeGrid from "@/components/college/CollegeGrid";
import { getUniqueLocations, getUniqueCourseNames, searchColleges, type SortOption } from "@/lib/queries";

const PAGE_SIZE = 6;

interface CollegesPageProps {
  searchParams: {
    q?: string;
    location?: string;
    course?: string;
    minFees?: string;
    maxFees?: string;
    minRating?: string;
    sort?: string;
    page?: string;
  };
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value || !/^\d+(\.\d+)?$/.test(value)) return undefined;
  return Number(value);
}

export default async function CollegesPage({ searchParams }: CollegesPageProps) {
  const requestedPage = Math.max(1, parseNumber(searchParams.page) ?? 1);
  const sort = (searchParams.sort ?? "relevance") as SortOption;
  const result = await searchColleges({
    q: searchParams.q,
    location: searchParams.location,
    course: searchParams.course,
    minFees: parseNumber(searchParams.minFees),
    maxFees: parseNumber(searchParams.maxFees),
    minRating: parseNumber(searchParams.minRating),
    sort,
    page: requestedPage,
    limit: PAGE_SIZE,
  });
  const [locations, courses] = await Promise.all([getUniqueLocations(), getUniqueCourseNames()]);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) params.set(key, value);
    });
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return `/colleges${query ? `?${query}` : ""}`;
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <p className="eyebrow mb-3">Explore colleges</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Find your shortlist</h1>
        <div className="mt-6 max-w-xl">
          <Suspense fallback={<div className="h-11" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <Suspense fallback={<div className="h-64 rounded border border-line bg-paper-raised" />}>
            <FilterPanel locations={locations} courses={courses} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-ink-faint">
              <span className="font-medium text-ink">{result.pagination.total}</span>{" "}
              {result.pagination.total === 1 ? "college" : "colleges"} found
            </p>
            <Suspense fallback={<div className="h-9 w-36" />}>
              <SortSelect />
            </Suspense>
          </div>

          <CollegeGrid colleges={result.data} />
          <Pagination
            currentPage={result.pagination.page}
            totalPages={result.pagination.totalPages}
            buildHref={buildHref}
          />
        </div>
      </div>
    </div>
  );
}

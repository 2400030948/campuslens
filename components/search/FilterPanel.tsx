"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface FilterPanelProps {
  locations: string[];
  courses: string[];
}

const FEE_RANGES = [
  { value: "", label: "Any fee range" },
  { value: "0-100000", label: "Under ₹1L / yr" },
  { value: "100000-250000", label: "₹1L – ₹2.5L / yr" },
  { value: "250000-500000", label: "₹2.5L – ₹5L / yr" },
  { value: "500000-", label: "Above ₹5L / yr" },
];

const RATINGS = [
  { value: "", label: "Any rating" },
  { value: "4.5", label: "4.5 & above" },
  { value: "4", label: "4.0 & above" },
  { value: "3.5", label: "3.5 & above" },
];

export default function FilterPanel({ locations, courses }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateFeeRange(range: string) {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("minFees");
    params.delete("maxFees");
    if (range) {
      const [min, max] = range.split("-");
      if (min) params.set("minFees", min);
      if (max) params.set("maxFees", max);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams?.toString());
    const q = params.get("q");
    params.forEach((_, key) => params.delete(key));
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCount = ["location", "course", "minFees", "minRating"].filter((k) =>
    searchParams?.get(k)
  ).length;

  const feeRangeValue = (() => {
    const min = searchParams?.get("minFees");
    const max = searchParams?.get("maxFees");
    if (!min && !max) return "";
    return `${min ?? "0"}-${max ?? ""}`;
  })();

  const fields = (
    <div className="space-y-5">
      <FilterField label="Location">
        <Select
          value={searchParams?.get("location") ?? ""}
          onChange={(e) => updateParam("location", e.target.value)}
          aria-label="Filter by location"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>
      </FilterField>

      <FilterField label="Course">
        <Select
          value={searchParams?.get("course") ?? ""}
          onChange={(e) => updateParam("course", e.target.value)}
          aria-label="Filter by course"
        >
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </Select>
      </FilterField>

      <FilterField label="Fee range">
        <Select
          value={feeRangeValue}
          onChange={(e) => updateFeeRange(e.target.value)}
          aria-label="Filter by fee range"
        >
          {FEE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>
      </FilterField>

      <FilterField label="Rating">
        <Select
          value={searchParams?.get("minRating") ?? ""}
          onChange={(e) => updateParam("minRating", e.target.value)}
          aria-label="Filter by minimum rating"
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </FilterField>

      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div>
      {/* Mobile toggle */}
      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-filter-panel"
          className="w-full justify-between"
        >
          <span>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
          <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
        </Button>
        {mobileOpen && (
          <div id="mobile-filter-panel" className="mt-4 rounded border border-line bg-paper-raised p-4">
            {fields}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden rounded border border-line bg-paper-raised p-5 lg:block">
        <h2 className="eyebrow mb-4">Filters</h2>
        {fields}
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</label>
      {children}
    </div>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Select from "@/components/ui/Select";

const SORT_OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "rating", label: "Highest rated" },
  { value: "fees-low", label: "Fees: low to high" },
  { value: "fees-high", label: "Fees: high to low" },
  { value: "package", label: "Average package" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams?.get("sort") ?? "relevance";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams?.toString());
    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-ink-faint sm:inline">Sort by</span>
      <Select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Sort colleges"
        className="w-auto min-w-[9rem]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </label>
  );
}

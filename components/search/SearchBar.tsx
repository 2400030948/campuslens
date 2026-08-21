"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SearchBarProps {
  placeholder?: string;
  suggestions?: string[];
  size?: "md" | "lg";
}

export default function SearchBar({
  placeholder = "Search by college, city, or course",
  suggestions = [],
  size = "md",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams?.get("q") ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.push(`/colleges?${params.toString()}`);
  }

  function handleSuggestion(term: string) {
    setValue(term);
    router.push(`/colleges?q=${encodeURIComponent(term)}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} role="search" aria-label="Search colleges" className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon />
          <Input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            aria-label="Search colleges"
            className={size === "lg" ? "py-3.5 pl-10 text-base" : "pl-10"}
          />
        </div>
        <Button type="submit" size={size === "lg" ? "md" : "sm"} className={size === "lg" ? "px-6" : ""}>
          Search
        </Button>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-faint">Popular:</span>
          {suggestions.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSuggestion(term)}
              className="rounded-sm border border-line-strong px-2.5 py-1 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

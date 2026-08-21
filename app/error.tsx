"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow mb-3">Something went wrong</p>
      <h1 className="font-display text-2xl font-semibold text-ink">We couldn&apos;t load this page.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-faint">
        Please try again. If the problem continues, the data service may be temporarily unavailable.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="primary" size="sm">
          Try again
        </Button>
        <Link href="/colleges" className="inline-flex items-center justify-center rounded border border-line-strong px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper-raised">
          Browse colleges
        </Link>
      </div>
    </main>
  );
}

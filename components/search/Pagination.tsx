import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <PageLink
        href={buildHref(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </PageLink>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded text-sm font-medium",
            page === currentPage
              ? "bg-ink text-paper"
              : "text-ink-soft hover:bg-ink/5 hover:text-ink"
          )}
        >
          {page}
        </Link>
      ))}

      <PageLink
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded px-2.5 py-1.5 text-sm text-ink-faint/50" aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="rounded px-2.5 py-1.5 text-sm text-ink-soft hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </Link>
  );
}

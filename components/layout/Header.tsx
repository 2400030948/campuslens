import Link from "next/link";

const NAV_LINKS = [
  { href: "/colleges", label: "Explore Colleges" },
  { href: "/compare", label: "Compare" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="CampusLens home">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            CampusLens
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/colleges"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/colleges"
            className="rounded bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Start exploring
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav aria-label="Primary mobile" className="flex items-center gap-6 border-t border-line px-5 py-2.5 md:hidden">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

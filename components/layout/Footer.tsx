import Link from "next/link";

const COLUMNS = [
  {
    heading: "Discover",
    links: [
      { href: "/colleges", label: "Explore colleges" },
      { href: "/colleges?sort=rating", label: "Top rated" },
      { href: "/compare", label: "Compare colleges" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/", label: "Our approach" },
      { href: "/", label: "How data is verified" },
      { href: "/", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <span className="font-display text-lg font-semibold text-ink">CampusLens</span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-faint">
            Structured, comparable information for every stage of choosing a college.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="eyebrow mb-4">{col.heading}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rule">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} CampusLens. All sample data is illustrative.</span>
          <span>Built for students, by design.</span>
        </div>
      </div>
    </footer>
  );
}

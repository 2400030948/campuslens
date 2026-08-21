import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/search/SearchBar";
import CollegeCard from "@/components/college/CollegeCard";
import { getFeaturedColleges } from "@/lib/queries";
import { LinkButton } from "@/components/ui/Button";

const POPULAR_SEARCHES = ["Engineering", "Mumbai", "MBA", "Under ₹1L fees", "Design"];

const VALUE_POINTS = [
  {
    title: "Structured, comparable data",
    body: "Every college is described with the same fields — fees, placements, ratings, courses — so you're never comparing apples to oranges.",
  },
  {
    title: "Built for side-by-side comparison",
    body: "Shortlist a handful of colleges and see exactly where they differ, with the meaningful gaps called out.",
  },
  {
    title: "Grounded in what matters",
    body: "Placement outcomes, acceptance rates, and course-level fees — not marketing copy — drive every page.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Search by college, city, or course, then narrow down with location, fees, and rating filters.",
  },
  {
    n: "02",
    title: "Evaluate",
    body: "Open a college's full profile — courses, fees, placements, and reviews from students who studied there.",
  },
  {
    n: "03",
    title: "Compare",
    body: "Line up two or three colleges side by side and see the differences that actually affect your decision.",
  },
];

export default async function LandingPage() {
  const featured = await getFeaturedColleges(6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">College discovery, done properly</p>
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Choose your college with evidence, not guesswork.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              CampusLens organises fees, placements, courses, and reviews into one
              consistent format — so you can discover, evaluate, and compare colleges
              on your own terms.
            </p>
            <div className="mt-8 max-w-lg">
              <Suspense fallback={<div className="h-11" />}>
                <SearchBar
                  size="lg"
                  placeholder="Try “engineering in Mumbai” or “MBA under ₹5L”"
                  suggestions={POPULAR_SEARCHES}
                />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {featured.slice(0, 4).map((college, i) => (
              <div
                key={college.id}
                className={`rounded border border-line bg-paper-raised p-4 ${i % 3 === 1 ? "sm:mt-6" : ""}`}
              >
                <p className="font-mono text-xs text-ink-faint">{college.city}</p>
                <p className="mt-1 font-display text-sm font-semibold leading-snug text-ink">
                  {college.shortName}
                </p>
                <p className="mt-2 font-mono text-xs text-brass-dark">★ {college.rating.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value section */}
      <section className="border-b border-line bg-paper-raised">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow mb-3">Why CampusLens</p>
          <h2 className="max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
            Information that&apos;s actually built for deciding.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
            {VALUE_POINTS.map((point) => (
              <div key={point.title} className="border-t border-line-strong pt-4">
                <h3 className="font-display text-base font-semibold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-faint">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured colleges */}
      <section className="border-b border-line">
        <div className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Featured</p>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Highly rated on CampusLens
              </h2>
            </div>
            <Link href="/colleges" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline">
              View all colleges →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
          <Link href="/colleges" className="mt-8 inline-block text-sm font-medium text-ink-soft hover:text-ink sm:hidden">
            View all colleges →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line bg-paper-raised">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
            Three steps, in an order that mirrors how decisions actually get made.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-xs text-brass-dark">{step.n}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-faint">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="container-page py-16 text-center sm:py-24">
          <h2 className="mx-auto max-w-lg font-display text-2xl font-semibold text-ink sm:text-3xl">
            Start comparing colleges in the next five minutes.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-faint">
            No sign-up required to browse. Shortlist a few colleges and see them side by side.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <LinkButton href="/colleges" variant="primary">
              Explore colleges
            </LinkButton>
            <LinkButton href="/compare" variant="outline">
              Go to comparison
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}

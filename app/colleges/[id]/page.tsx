import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCollegeSlugs, getCollegeBySlug, getRelatedColleges } from "@/lib/queries";
import CollegeHeader from "@/components/college/CollegeHeader";
import StatCard from "@/components/college/StatCard";
import CourseList from "@/components/college/CourseList";
import PlacementStats from "@/components/college/PlacementStats";
import ReviewCard from "@/components/college/ReviewCard";
import RelatedColleges from "@/components/college/RelatedColleges";

interface CollegeDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const slugs = await getAllCollegeSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: CollegeDetailPageProps): Promise<Metadata> {
  const college = await getCollegeBySlug(params.id);
  if (!college) return { title: "College not found — CampusLens" };
  return {
    title: `${college.name} — CampusLens`,
    description: college.description,
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses & fees" },
  { id: "placements", label: "Placements" },
  { id: "reviews", label: "Reviews" },
];

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const college = await getCollegeBySlug(params.id);
  if (!college) notFound();

  const related = await getRelatedColleges(college, 3);

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/colleges" className="hover:text-ink">Colleges</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-soft">{college.shortName}</span>
      </nav>

      <CollegeHeader college={college} />

      <nav aria-label="Sections" className="sticky top-16 z-30 mt-8 flex gap-6 overflow-x-auto border-y border-line bg-paper py-3">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="whitespace-nowrap text-sm font-medium text-ink-soft hover:text-ink"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
        <div className="space-y-14">
          <section id="overview" className="scroll-mt-32">
            <h2 className="font-display text-xl font-semibold text-ink">Overview</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {college.longDescription}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Students" value={college.studentCount.toLocaleString("en-IN")} />
              <StatCard label="Faculty ratio" value={college.facultyRatio} />
              <StatCard label="Campus size" value={`${college.campusSizeAcres} acres`} />
              <StatCard label="Established" value={String(college.established)} />
            </div>
          </section>

          <section id="courses" className="scroll-mt-32">
            <h2 className="font-display text-xl font-semibold text-ink">Courses & fees</h2>
            <p className="mt-2 text-sm text-ink-faint">
              Annual fees vary by program — see individual course rows for exact figures.
            </p>
            <div className="mt-5">
              <CourseList courses={college.courses} />
            </div>
          </section>

          <section id="placements" className="scroll-mt-32">
            <h2 className="font-display text-xl font-semibold text-ink">Placements</h2>
            <p className="mt-2 text-sm text-ink-faint">
              Figures are self-reported by the institution for the most recent graduating batch.
            </p>
            <div className="mt-5">
              <PlacementStats college={college} />
            </div>
          </section>

          <section id="reviews" className="scroll-mt-32">
            <h2 className="font-display text-xl font-semibold text-ink">
              Reviews <span className="text-ink-faint">({college.totalReviews})</span>
            </h2>
            <div className="mt-4">
              {college.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:h-fit">
          <div className="rounded border border-line bg-paper-raised p-5">
            <h3 className="eyebrow mb-4">At a glance</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Type" value={college.type} />
              <Row label="Location" value={`${college.city}, ${college.state}`} />
              <Row label="Established" value={String(college.established)} />
              <Row label="Acceptance rate" value={`${college.acceptanceRate}%`} />
            </dl>
          </div>
        </aside>
      </div>

      <div className="mt-16 border-t border-line pt-14">
        <RelatedColleges colleges={related} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-line pt-3 first:border-0 first:pt-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

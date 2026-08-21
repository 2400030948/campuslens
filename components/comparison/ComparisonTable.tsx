import Link from "next/link";
import { College } from "@/lib/data/types";
import { formatFees, formatPackage, formatRating, cn } from "@/lib/utils";
import CollegeMark from "@/components/college/CollegeMark";
import Badge from "@/components/ui/Badge";

interface ComparisonTableProps {
  colleges: College[];
}

type RowDirection = "higher-better" | "lower-better" | "neutral";

interface Row {
  label: string;
  direction: RowDirection;
  values: (college: College) => { display: string; raw: number | null };
}

const ROWS: Row[] = [
  {
    label: "Rating",
    direction: "higher-better",
    values: (c) => ({ display: `${formatRating(c.rating)} (${c.totalReviews})`, raw: c.rating }),
  },
  {
    label: "Annual fees",
    direction: "lower-better",
    values: (c) => ({ display: formatFees(c.annualFees), raw: c.annualFees }),
  },
  {
    label: "Average package",
    direction: "higher-better",
    values: (c) => ({ display: formatPackage(c.averagePackage), raw: c.averagePackage }),
  },
  {
    label: "Highest package",
    direction: "higher-better",
    values: (c) => ({ display: formatPackage(c.highestPackage), raw: c.highestPackage }),
  },
  {
    label: "Acceptance rate",
    direction: "lower-better",
    values: (c) => ({ display: `${c.acceptanceRate}%`, raw: c.acceptanceRate }),
  },
  {
    label: "Campus size",
    direction: "neutral",
    values: (c) => ({ display: `${c.campusSizeAcres} acres`, raw: null }),
  },
];

export default function ComparisonTable({ colleges }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-line">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-40 bg-paper-raised px-4 py-4 text-left align-bottom">
              <span className="eyebrow">Compare</span>
            </th>
            {colleges.map((college) => (
              <th key={college.id} scope="col" className="min-w-[200px] border-l border-line bg-paper-raised px-4 py-4 text-left align-bottom">
                <CollegeMark name={college.shortName} accentIndex={college.accentIndex} size="sm" />
                <Link
                  href={`/colleges/${college.slug}`}
                  className="mt-2 block font-display text-sm font-semibold leading-snug text-ink hover:underline"
                >
                  {college.name}
                </Link>
                <p className="mt-1 text-xs text-ink-faint">{college.city}, {college.state}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const cells = colleges.map((c) => row.values(c));
            const rawValues = cells.map((c) => c.raw).filter((v): v is number => v !== null);
            const best =
              row.direction === "higher-better"
                ? Math.max(...rawValues)
                : row.direction === "lower-better"
                ? Math.min(...rawValues)
                : null;

            return (
              <tr key={row.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 text-left text-xs font-medium text-ink-soft">
                  {row.label}
                </th>
                {colleges.map((college, i) => {
                  const cell = cells[i];
                  const isBest = best !== null && cell?.raw === best && rawValues.length > 1 && new Set(rawValues).size > 1;
                  return (
                    <td
                      key={college.id}
                      className={cn(
                        "border-l border-line px-4 py-3.5 font-mono text-ink",
                        isBest && "bg-forest-tint font-medium text-forest"
                      )}
                    >
                      {cell?.display}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          <tr className="border-t border-line">
            <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 text-left text-xs font-medium text-ink-soft align-top">
              Courses offered
            </th>
            {colleges.map((college) => (
              <td key={college.id} className="border-l border-line px-4 py-3.5 align-top">
                <div className="flex flex-wrap gap-1.5">
                  {college.courses.slice(0, 4).map((course) => (
                    <Badge key={course.id}>{course.degree}</Badge>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

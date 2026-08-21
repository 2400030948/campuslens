import { Course } from "@/lib/data/types";
import { formatFees } from "@/lib/utils";

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  return (
    <div className="overflow-x-auto rounded border border-line">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-paper-raised">
            <th scope="col" className="eyebrow px-4 py-3 font-medium">Program</th>
            <th scope="col" className="eyebrow px-4 py-3 font-medium">Degree</th>
            <th scope="col" className="eyebrow px-4 py-3 font-medium">Duration</th>
            <th scope="col" className="eyebrow px-4 py-3 font-medium">Annual fees</th>
            <th scope="col" className="eyebrow px-4 py-3 font-medium">Seats</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3.5 font-medium text-ink">{course.name}</td>
              <td className="px-4 py-3.5 text-ink-soft">{course.degree}</td>
              <td className="px-4 py-3.5 text-ink-soft">{course.durationYears} yrs</td>
              <td className="px-4 py-3.5 font-mono text-ink-soft">{formatFees(course.annualFees)}</td>
              <td className="px-4 py-3.5 font-mono text-ink-soft">{course.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

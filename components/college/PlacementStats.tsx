import { College } from "@/lib/data/types";
import { formatPackage } from "@/lib/utils";
import StatCard from "./StatCard";

interface PlacementStatsProps {
  college: College;
}

export default function PlacementStats({ college }: PlacementStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Average package" value={formatPackage(college.averagePackage)} />
      <StatCard label="Highest package" value={formatPackage(college.highestPackage)} />
      <StatCard label="Acceptance rate" value={`${college.acceptanceRate}%`} />
      <StatCard label="Faculty ratio" value={college.facultyRatio} />
    </div>
  );
}

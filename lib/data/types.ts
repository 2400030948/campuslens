export type CollegeType = "Public" | "Private" | "Deemed" | "Autonomous";

export interface Course {
  id: string;
  name: string;
  degree: string;
  durationYears: number;
  annualFees: number;
  seats: number;
}

export interface Review {
  id: string;
  author: string;
  course: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Placement {
  id: string;
  averagePackage: number;
  highestPackage: number;
  medianPackage: number;
  placementRate: number;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: CollegeType;
  established: number;
  rating: number;
  totalReviews: number;
  annualFees: number;
  averagePackage: number;
  highestPackage: number;
  acceptanceRate: number;
  studentCount: number;
  facultyRatio: string;
  campusSizeAcres: number;
  description: string;
  longDescription: string;
  tags: string[];
  courses: Course[];
  placement?: Placement;
  reviews: Review[];
  accentIndex: number;
}

// Anticipated future backend fields (not implemented in this frontend phase):
// - verified admissions data feed
// - live seat availability
// - user save/shortlist state (requires auth)
// - personalized ranking signals

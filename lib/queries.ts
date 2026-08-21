import type { Prisma } from "@prisma/client";
import { colleges as mockColleges } from "./data/colleges";
import type { College, CollegeType } from "./data/types";
import { prisma } from "./prisma";

export interface CollegeFilters {
  q?: string;
  location?: string;
  city?: string;
  state?: string;
  course?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption =
  | "relevance"
  | "rating"
  | "fees"
  | "fees-low"
  | "fees-high"
  | "placement"
  | "package"
  | "name";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CollegeListResult {
  data: College[];
  pagination: Pagination;
}

const detailInclude = {
  courses: { orderBy: { name: "asc" as const } },
  reviews: { orderBy: { date: "desc" as const } },
  placement: true,
} satisfies Prisma.CollegeInclude;

type CollegeRecord = Prisma.CollegeGetPayload<{ include: typeof detailInclude }>;

type CollegeListRecord = Prisma.CollegeGetPayload<{
  include: { placement: true };
}>;

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function normalizeMockCollege(college: College): College {
  return {
    ...college,
    placement: {
      id: `placement-${college.id}`,
      averagePackage: college.averagePackage,
      highestPackage: college.highestPackage,
      medianPackage: Math.round(college.averagePackage * 0.86 * 10) / 10,
      placementRate: Math.round(Math.min(98, Math.max(60, 68 + college.rating * 5 - Math.min(college.acceptanceRate, 20) * 0.15)) * 10) / 10,
    },
  };
}

function mapCollege(record: CollegeRecord | CollegeListRecord): College {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    shortName: record.shortName,
    city: record.city,
    state: record.state,
    type: record.type as CollegeType,
    established: record.established,
    rating: record.rating,
    totalReviews: record.totalReviews,
    annualFees: record.annualFees,
    averagePackage: record.placement?.averagePackage ?? 0,
    highestPackage: record.placement?.highestPackage ?? 0,
    acceptanceRate: record.acceptanceRate,
    studentCount: record.studentCount,
    facultyRatio: record.facultyRatio,
    campusSizeAcres: record.campusSizeAcres,
    description: record.description,
    longDescription: record.longDescription,
    tags: record.tags,
    courses: "courses" in record
      ? record.courses.map((course) => ({
          id: course.id,
          name: course.name,
          degree: course.degree,
          durationYears: course.durationYears,
          annualFees: course.annualFees,
          seats: course.seats,
        }))
      : [],
    placement: record.placement
      ? {
          id: record.placement.id,
          averagePackage: record.placement.averagePackage,
          highestPackage: record.placement.highestPackage,
          medianPackage: record.placement.medianPackage,
          placementRate: record.placement.placementRate,
        }
      : undefined,
    reviews: "reviews" in record
      ? record.reviews.map((review) => ({
          id: review.id,
          author: review.author,
          course: review.course,
          rating: review.rating,
          date: review.date.toISOString().slice(0, 10),
          title: review.title,
          body: review.body,
        }))
      : [],
    accentIndex: record.accentIndex,
  };
}

function sortMockColleges(list: College[], sort: SortOption): College[] {
  const sorted = [...list];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    case "fees":
    case "fees-low":
      return sorted.sort((a, b) => a.annualFees - b.annualFees || a.name.localeCompare(b.name));
    case "fees-high":
      return sorted.sort((a, b) => b.annualFees - a.annualFees || a.name.localeCompare(b.name));
    case "placement":
    case "package":
      return sorted.sort((a, b) => b.averagePackage - a.averagePackage || a.name.localeCompare(b.name));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "relevance":
    default:
      return sorted;
  }
}

function filterMockColleges(filters: CollegeFilters): College[] {
  let results = [...mockColleges];
  const query = filters.q?.trim().toLowerCase();
  const location = (filters.location ?? "").trim().toLowerCase();
  const city = (filters.city ?? "").trim().toLowerCase();
  const state = (filters.state ?? "").trim().toLowerCase();
  const course = (filters.course ?? "").trim().toLowerCase();

  if (query) {
    results = results.filter((college) =>
      [college.name, college.shortName, college.city, college.state, college.description, ...college.tags]
        .some((value) => value.toLowerCase().includes(query)) ||
      college.courses.some((item) => item.name.toLowerCase().includes(query)),
    );
  }
  if (location) {
    results = results.filter((college) =>
      college.city.toLowerCase() === location || college.state.toLowerCase() === location,
    );
  }
  if (city) results = results.filter((college) => college.city.toLowerCase() === city);
  if (state) results = results.filter((college) => college.state.toLowerCase() === state);
  if (course) {
    results = results.filter((college) => college.courses.some((item) => item.name.toLowerCase().includes(course)));
  }
  if (filters.minFees !== undefined) results = results.filter((college) => college.annualFees >= filters.minFees!);
  if (filters.maxFees !== undefined) results = results.filter((college) => college.annualFees <= filters.maxFees!);
  if (filters.minRating !== undefined) results = results.filter((college) => college.rating >= filters.minRating!);
  return sortMockColleges(results, filters.sort ?? "relevance");
}

function buildWhere(filters: CollegeFilters): Prisma.CollegeWhereInput {
  const query = filters.q?.trim();
  const location = filters.location?.trim();
  const city = filters.city?.trim();
  const state = filters.state?.trim();
  const course = filters.course?.trim();
  const conditions: Prisma.CollegeWhereInput[] = [];

  if (query) {
    conditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { shortName: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
        { state: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
        { courses: { some: { name: { contains: query, mode: "insensitive" } } } },
      ],
    });
  }
  if (location) {
    conditions.push({
      OR: [
        { city: { equals: location, mode: "insensitive" } },
        { state: { equals: location, mode: "insensitive" } },
      ],
    });
  }
  if (city) conditions.push({ city: { equals: city, mode: "insensitive" } });
  if (state) conditions.push({ state: { equals: state, mode: "insensitive" } });
  if (course) conditions.push({ courses: { some: { name: { contains: course, mode: "insensitive" } } } });
  if (filters.minFees !== undefined || filters.maxFees !== undefined) {
    conditions.push({
      annualFees: {
        ...(filters.minFees !== undefined ? { gte: filters.minFees } : {}),
        ...(filters.maxFees !== undefined ? { lte: filters.maxFees } : {}),
      },
    });
  }
  if (filters.minRating !== undefined) conditions.push({ rating: { gte: filters.minRating } });
  return conditions.length ? { AND: conditions } : {};
}

function getOrderBy(
  sort: SortOption,
): Prisma.CollegeOrderByWithRelationInput | Prisma.CollegeOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ rating: "desc" }, { name: "asc" }];
    case "fees":
    case "fees-low":
      return [{ annualFees: "asc" }, { name: "asc" }];
    case "fees-high":
      return [{ annualFees: "desc" }, { name: "asc" }];
    case "placement":
    case "package":
      return [{ placement: { averagePackage: "desc" } }, { name: "asc" }];
    case "name":
      return { name: "asc" };
    case "relevance":
    default:
      return { name: "asc" };
  }
}

export async function searchColleges(filters: CollegeFilters = {}): Promise<CollegeListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(50, Math.max(1, Math.floor(filters.limit ?? 12)));
  const safeFilters = { ...filters, sort: filters.sort ?? "relevance" };

  if (!hasDatabaseUrl()) {
    const filtered = filterMockColleges(safeFilters);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const boundedPage = Math.min(page, totalPages);
    return {
      data: filtered.slice((boundedPage - 1) * limit, boundedPage * limit).map(normalizeMockCollege),
      pagination: { page: boundedPage, limit, total, totalPages },
    };
  }

  const where = buildWhere(safeFilters);
  const total = await prisma.college.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const boundedPage = Math.min(page, totalPages);
  const records = await prisma.college.findMany({
    where,
    include: { placement: true },
    orderBy: getOrderBy(safeFilters.sort),
    skip: (boundedPage - 1) * limit,
    take: limit,
  });
  return {
    data: records.map(mapCollege),
    pagination: { page: boundedPage, limit, total, totalPages },
  };
}

export async function getColleges(filters: CollegeFilters = {}): Promise<College[]> {
  if (!hasDatabaseUrl()) return filterMockColleges(filters).map(normalizeMockCollege);
  const result = await searchColleges({ ...filters, page: 1, limit: 50 });
  return result.data;
}

export async function getCollegeBySlug(slug: string): Promise<College | undefined> {
  if (!hasDatabaseUrl()) {
    const college = mockColleges.find((item) => item.slug === slug);
    return college ? normalizeMockCollege(college) : undefined;
  }
  const record = await prisma.college.findUnique({ where: { slug }, include: detailInclude });
  return record ? mapCollege(record) : undefined;
}

export async function getCollegeById(id: string): Promise<College | undefined> {
  if (!hasDatabaseUrl()) {
    const college = mockColleges.find((item) => item.id === id);
    return college ? normalizeMockCollege(college) : undefined;
  }
  const record = await prisma.college.findUnique({ where: { id }, include: detailInclude });
  return record ? mapCollege(record) : undefined;
}

export async function getAllCollegeSlugs(): Promise<string[]> {
  if (!hasDatabaseUrl()) return mockColleges.map((college) => college.slug);
  const records = await prisma.college.findMany({ select: { slug: true }, orderBy: { name: "asc" } });
  return records.map((record) => record.slug);
}

export async function getRelatedColleges(current: College, limit = 3): Promise<College[]> {
  if (!hasDatabaseUrl()) {
    return mockColleges
      .filter((college) => college.id !== current.id)
      .map((college) => ({
        college,
        score:
          (college.city === current.city ? 2 : 0) +
          (college.type === current.type ? 1 : 0) +
          college.tags.filter((tag) => current.tags.includes(tag)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => normalizeMockCollege(entry.college));
  }

  const records = await prisma.college.findMany({
    where: { id: { not: current.id }, OR: [{ city: current.city }, { type: current.type }] },
    include: { placement: true },
    orderBy: [{ rating: "desc" }, { name: "asc" }],
    take: limit,
  });
  return records.map(mapCollege);
}

export async function getFeaturedColleges(limit = 6): Promise<College[]> {
  if (!hasDatabaseUrl()) return sortMockColleges(mockColleges, "rating").slice(0, limit).map(normalizeMockCollege);
  const records = await prisma.college.findMany({
    include: { placement: true },
    orderBy: [{ rating: "desc" }, { name: "asc" }],
    take: limit,
  });
  return records.map(mapCollege);
}

export async function getUniqueLocations(): Promise<string[]> {
  if (!hasDatabaseUrl()) return Array.from(new Set(mockColleges.map((college) => college.city))).sort();
  const records = await prisma.college.findMany({ distinct: ["city"], select: { city: true }, orderBy: { city: "asc" } });
  return records.map((record) => record.city);
}

export async function getUniqueCourseNames(): Promise<string[]> {
  if (!hasDatabaseUrl()) {
    return Array.from(new Set(mockColleges.flatMap((college) => college.courses.map((course) => course.name)))).sort();
  }
  const records = await prisma.course.findMany({ distinct: ["name"], select: { name: true }, orderBy: { name: "asc" } });
  return records.map((record) => record.name);
}

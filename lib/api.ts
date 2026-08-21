import { NextResponse } from "next/server";
import type { SortOption } from "./queries";

export class ApiInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiInputError";
  }
}

export function errorResponse(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function unexpectedErrorResponse(): NextResponse {
  return errorResponse(500, "INTERNAL_SERVER_ERROR", "Something went wrong while loading college data.");
}

function getOptionalText(value: string | null, field: string, maxLength = 100): string | undefined {
  if (value === null || value.trim() === "") return undefined;
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new ApiInputError(`${field} must be ${maxLength} characters or fewer.`);
  return trimmed;
}

function getOptionalNumber(
  value: string | null,
  field: string,
  options: { min: number; max: number; integer?: boolean },
): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (options.integer && !Number.isInteger(parsed))) {
    throw new ApiInputError(`${field} must be a valid ${options.integer ? "integer" : "number"}.`);
  }
  if (parsed < options.min || parsed > options.max) {
    throw new ApiInputError(`${field} must be between ${options.min} and ${options.max}.`);
  }
  return parsed;
}

const SORTS: SortOption[] = [
  "relevance",
  "rating",
  "fees",
  "fees-low",
  "fees-high",
  "placement",
  "package",
  "name",
];

export function parseCollegeListParams(searchParams: URLSearchParams) {
  const sortValue = getOptionalText(searchParams.get("sort"), "sort", 20) ?? "relevance";
  if (!SORTS.includes(sortValue as SortOption)) {
    throw new ApiInputError("sort must be one of relevance, rating, fees, fees-low, fees-high, placement, package, or name.");
  }
  const page = getOptionalNumber(searchParams.get("page"), "page", { min: 1, max: 100000, integer: true }) ?? 1;
  const limit = getOptionalNumber(searchParams.get("limit"), "limit", { min: 1, max: 50, integer: true }) ?? 12;
  const minFees = getOptionalNumber(searchParams.get("minFees"), "minFees", { min: 0, max: 100000000, integer: true });
  const maxFees = getOptionalNumber(searchParams.get("maxFees"), "maxFees", { min: 0, max: 100000000, integer: true });
  const minRating = getOptionalNumber(searchParams.get("minRating"), "minRating", { min: 0, max: 5 });
  if (minFees !== undefined && maxFees !== undefined && minFees > maxFees) {
    throw new ApiInputError("minFees cannot be greater than maxFees.");
  }

  return {
    q: getOptionalText(searchParams.get("q"), "q"),
    location: getOptionalText(searchParams.get("location"), "location"),
    city: getOptionalText(searchParams.get("city"), "city"),
    state: getOptionalText(searchParams.get("state"), "state"),
    course: getOptionalText(searchParams.get("course"), "course"),
    minFees,
    maxFees,
    minRating,
    sort: sortValue as SortOption,
    page,
    limit,
  };
}

export function parseCollegeId(value: string): string {
  const id = value.trim();
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) throw new ApiInputError("College ID is invalid.");
  return id;
}

export function parseComparisonIds(value: string | null): string[] {
  if (!value) throw new ApiInputError("Provide two or three college IDs to compare.");
  const ids = value.split(",").map((id) => id.trim()).filter(Boolean);
  if (ids.length < 2 || ids.length > 3) throw new ApiInputError("Comparison requires two or three colleges.");
  if (new Set(ids).size !== ids.length) throw new ApiInputError("Comparison IDs must be unique.");
  ids.forEach(parseCollegeId);
  return ids;
}

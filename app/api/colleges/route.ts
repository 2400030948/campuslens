import { NextRequest, NextResponse } from "next/server";
import { ApiInputError, errorResponse, parseCollegeListParams, unexpectedErrorResponse } from "@/lib/api";
import { searchColleges } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const filters = parseCollegeListParams(request.nextUrl.searchParams);
    const result = await searchColleges(filters);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiInputError) return errorResponse(400, "INVALID_QUERY", error.message);
    console.error("[GET /api/colleges]", error);
    return unexpectedErrorResponse();
  }
}

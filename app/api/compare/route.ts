import { NextRequest, NextResponse } from "next/server";
import { ApiInputError, errorResponse, parseComparisonIds, unexpectedErrorResponse } from "@/lib/api";
import { getCollegeById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ids = parseComparisonIds(request.nextUrl.searchParams.get("ids"));
    const colleges = await Promise.all(ids.map((id) => getCollegeById(id)));
    if (colleges.some((college) => !college)) {
      return errorResponse(404, "COLLEGE_NOT_FOUND", "One or more colleges could not be found.");
    }
    return NextResponse.json({ data: colleges });
  } catch (error) {
    if (error instanceof ApiInputError) return errorResponse(400, "INVALID_COMPARISON", error.message);
    console.error("[GET /api/compare]", error);
    return unexpectedErrorResponse();
  }
}

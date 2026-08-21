import { NextRequest, NextResponse } from "next/server";
import { ApiInputError, errorResponse, parseCollegeId, unexpectedErrorResponse } from "@/lib/api";
import { getCollegeById, getCollegeBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const id = parseCollegeId(params.id);
    const college = (await getCollegeById(id)) ?? (await getCollegeBySlug(id));
    if (!college) return errorResponse(404, "COLLEGE_NOT_FOUND", "College not found.");
    return NextResponse.json({ data: college });
  } catch (error) {
    if (error instanceof ApiInputError) return errorResponse(400, "INVALID_ID", error.message);
    console.error("[GET /api/colleges/[id]]", error);
    return unexpectedErrorResponse();
  }
}

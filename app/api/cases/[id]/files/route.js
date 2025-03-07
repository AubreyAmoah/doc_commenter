// app/api/cases/[id]/files/route.js
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCaseFiles } from "@/lib/drive";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const caseId = params.id;
    const files = await getCaseFiles(session.accessToken, caseId);
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching case files:", error);
    return NextResponse.json(
      { error: "Failed to fetch case files" },
      { status: 500 }
    );
  }
}

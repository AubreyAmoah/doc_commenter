// app/api/cases/[id]/route.js
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCaseDetails } from "@/lib/drive";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const caseId = params.id;
    const caseData = await getCaseDetails(session.accessToken, caseId);
    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Error fetching case details:", error);
    return NextResponse.json(
      { error: "Failed to fetch case details" },
      { status: 500 }
    );
  }
}

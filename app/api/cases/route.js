// app/api/cases/route.js
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { searchCases } from "@/lib/drive";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const cases = await searchCases(session.accessToken, query);
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error searching cases:", error);
    return NextResponse.json(
      { error: "Failed to search cases" },
      { status: 500 }
    );
  }
}

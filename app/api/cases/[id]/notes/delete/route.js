// app/api/cases/[id]/notes/delete/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteNote } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get case ID from route params
    const caseId = params.id;

    // Get note ID from request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const noteId = body.id;

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    console.log("Deleting note:", { caseId, noteId });

    try {
      // Delete the note using your database function
      const result = await deleteNote(noteId);

      if (!result) {
        return NextResponse.json(
          { error: "Note not found or could not be deleted" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error during deletion:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in delete note handler:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// app/api/cases/[id]/notes/route.js
import { NextResponse } from "next/server";
import { authOptions, getSession } from "@/lib/auth";
import { getCaseNotes, createNote, updateNote, deleteNote } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const caseId = params.id;
    const notes = await getCaseNotes(caseId);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching case notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch case notes" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const caseId = params.id;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const createdBy = {
      email: session.user.email,
      name: session.user.name,
    };

    const noteId = await createNote(caseId, content, createdBy);
    const note = await getCaseNotes(caseId).then((notes) =>
      notes.find((n) => n._id.toString() === noteId.toString())
    );

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// app/api/cases/[id]/notes/route.js
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Extract and log all parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const noteId = searchParams.get("id");

    console.log("API route - PUT request parameters:", {
      caseId: params.id,
      noteId: noteId,
      url: request.url,
    });

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Parse JSON body with error handling
    let content;
    try {
      const body = await request.json();
      content = body.content;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    try {
      const success = await updateNote(noteId, content);

      if (!success) {
        return NextResponse.json(
          { error: "Note not found or not updated" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error in PUT handler:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// Similarly update the DELETE handler
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Extract URL parameters and log them
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const noteId = searchParams.get("id");

    // Try to get ID from different places if it's missing
    if (!noteId) {
      // Try to get from request body as fallback
      try {
        const body = await request.json().catch(() => ({}));
        noteId = body.id;
      } catch (e) {
        console.log("No JSON body in request");
      }
    }

    console.log("Note ID from all sources:", {
      fromURL: url.searchParams.get("id"),
      fromParams: params,
      finalNoteId: noteId,
    });

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    try {
      const success = await deleteNote(noteId);

      if (!success) {
        return NextResponse.json(
          { error: "Note not found or not deleted" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error in DELETE handler:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

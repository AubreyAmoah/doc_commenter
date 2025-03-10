// app/api/cases/[id]/notes/route.js
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCaseNotes, createNote, updateNote, deleteNote } from "@/lib/db";

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

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    console.log("Updating note with ID:", noteId); // Add logging

    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    try {
      await updateNote(noteId, content);
      console.log("Note updated successfully"); // Add success logging
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error:", dbError); // Log database errors
      return NextResponse.json(
        { error: "Database operation failed", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    await deleteNote(noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

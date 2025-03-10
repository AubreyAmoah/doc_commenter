// app/api/cases/[id]/notes/update/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateNote } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get case ID from route params
    const caseId = params.id;
    
    // Get note ID and content from request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { id: noteId, content } = body;
    
    if (!noteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }
    
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 });
    }
    
    console.log("Updating note:", { caseId, noteId, contentLength: content.length });
    
    try {
      // Update the note using your database function
      const result = await updateNote(noteId, content);
      
      if (!result) {
        return NextResponse.json({ error: "Note not found or could not be updated" }, { status: 404 });
      }
      
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error during update:", dbError);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in update note handler:", error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
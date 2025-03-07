// app/cases/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CaseDetails from "@/components/CaseDetails";
import NoteForm from "@/components/NoteForm";
import NoteItem from "@/components/NoteItem";

export default function CaseDetailsPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const caseId = params.id;

  const [caseData, setCaseData] = useState(null);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }

    if (status === "authenticated" && caseId) {
      fetchCaseData();
      fetchNotes();
    }
  }, [status, caseId]);

  const fetchCaseData = async () => {
    try {
      const caseResponse = await fetch(`/api/cases/${caseId}`);
      const filesResponse = await fetch(`/api/cases/${caseId}/files`);

      if (!caseResponse.ok || !filesResponse.ok) {
        throw new Error("Failed to fetch case data");
      }

      const caseData = await caseResponse.json();
      const filesData = await filesResponse.json();

      setCaseData(caseData);
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching case data:", error);
      setError("Failed to load case data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/cases/${caseId}/notes`);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const notesData = await response.json();
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(
      notes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(notes.filter((note) => note._id !== noteId));
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-8">Loading case data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!caseData) {
    return <div className="text-center py-8">Case not found</div>;
  }

  return (
    <div className="space-y-8">
      <CaseDetails caseData={caseData} files={files} />

      <NoteForm caseId={caseId} onNoteCreated={handleNoteCreated} />

      <div>
        <h3 className="text-xl font-bold text-blue-800 mb-4">
          Case Notes & Reminders
        </h3>
        {notes.length > 0 ? (
          <div>
            {notes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                onNoteUpdated={handleNoteUpdated}
                onNoteDeleted={handleNoteDeleted}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No notes found for this case.</p>
        )}
      </div>
    </div>
  );
}

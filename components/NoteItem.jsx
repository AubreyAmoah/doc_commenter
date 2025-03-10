// components/NoteItem.jsx
"use client";

import { useEffect, useState } from "react";

export default function NoteItem({ note, onNoteUpdated, onNoteDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In NoteItem.jsx component
  const handleUpdate = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // Log what we're trying to send
      console.log("Updating note:", {
        noteId: note._id,
        caseId: note.caseId,
        content: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
      });

      // Make sure URL is properly formatted
      const url = `/api/cases/${encodeURIComponent(
        note.caseId
      )}/notes?id=${encodeURIComponent(note._id)}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // Log response status
      console.log("Update response status:", response.status);

      if (response.ok) {
        setIsEditing(false);
        if (onNoteUpdated) {
          onNoteUpdated({ ...note, content });
        }
      } else {
        // Try to get detailed error information
        let errorMessage = "Update failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Unknown error";
          console.error("Update failed - Server response:", errorData);
        } catch (e) {
          console.error("Couldn't parse error response:", e);
        }

        alert(`Update failed: ${errorMessage} (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Network error during update:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Similarly update the handleDelete function
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      console.log("Deleting note:", { noteId: note._id, caseId: note.caseId });

      // Make sure URL is properly formatted
      const url = `/api/cases/${encodeURIComponent(
        note.caseId
      )}/notes?id=${encodeURIComponent(note._id)}`;
      console.log("Request URL:", url);

      const response = await fetch(url, { method: "DELETE" });

      console.log("Delete response status:", response.status);

      if (response.ok) {
        if (onNoteDeleted) {
          onNoteDeleted(note._id);
        }
      } else {
        let errorMessage = "Delete failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Unknown error";
          console.error("Delete failed - Server response:", errorData);
        } catch (e) {
          console.error("Couldn't parse error response:", e);
        }

        alert(`Delete failed: ${errorMessage} (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Network error during delete:", error);
      alert(`Network error: ${error.message}`);
    }
  };

  // When fetching notes, check the ID format
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/cases/${caseId}/notes`);

        if (response.ok) {
          const notesData = await response.json();

          // Log the note IDs to check their format
          console.log(
            "Notes received:",
            notesData.map((note) => ({
              id: note._id,
              idType: typeof note._id,
            }))
          );

          setNotes(notesData);
        } else {
          console.error("Failed to fetch notes");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [caseId]);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {isEditing ? (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-black"
            rows="3"
          ></textarea>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="bg-blue-800 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 whitespace-pre-line">{note.content}</p>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-500">
              {new Date(note.createdAt).toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

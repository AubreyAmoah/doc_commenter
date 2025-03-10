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
      console.log("Updating note:", { noteId: note._id, caseId: note.caseId });

      // Use the new update endpoint
      const response = await fetch(`/api/cases/${note.caseId}/notes/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: note._id,
          content,
        }),
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        setIsEditing(false);
        if (onNoteUpdated) {
          onNoteUpdated({ ...note, content });
        }
      } else {
        const errorData = await response
          .json()
          .catch((e) => ({ error: "Unknown error" }));
        console.error("Update failed:", errorData);
        alert(
          `Update failed: ${errorData.error || "Unknown error"} (Status: ${
            response.status
          })`
        );
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Similarly update the handleDelete function
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/cases/${note.caseId}/notes/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note._id }),
      });

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

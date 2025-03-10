// components/NoteItem.jsx
"use client";

import { useState } from "react";

export default function NoteItem({ note, onNoteUpdated, onNoteDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/cases/${note.caseId}/notes?id=${note._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        if (onNoteUpdated) {
          onNoteUpdated({ ...note, content });
        }
      } else {
        // Improved error handling
        const errorData = await response.json();
        console.error("Failed to update note:", errorData);
        alert(`Error updating note: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(
        `/api/cases/${note.caseId}/notes?id=${note._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        if (onNoteDeleted) {
          onNoteDeleted(note._id);
        }
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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

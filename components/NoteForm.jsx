// components/NoteForm.jsx
"use client";

import { useState } from "react";

export default function NoteForm({ caseId, onNoteCreated }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent("");
        if (onNoteCreated) {
          const data = await response.json();
          onNoteCreated(data);
        }
      } else {
        console.error("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        Add Note or Reminder
      </h3>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Add important events, reminders, or notes about this case..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
}

// components/SearchBar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "Search cases..." }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cases?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg">
      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2">
          Search
        </button>
      </div>
    </form>
  );
}

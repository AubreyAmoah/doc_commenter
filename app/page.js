// app/page.jsx
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AuthStatus from "@/components/AuthStatus"; 

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">
        Legal Case Notes
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Search and manage digital notes for your legal cases stored in Google
        Drive
      </p>

      <div className="w-full max-w-lg mb-8">
        <SearchBar />
      </div>

      <AuthStatus />
    </div>
  );
}

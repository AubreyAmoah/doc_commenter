// app/cases/page.jsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { searchCases } from "@/lib/drive";
import SearchBar from "@/components/SearchBar";
import CaseList from "@/components/CaseList";

export default async function CasesPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const query = await searchParams.q || "";
  let cases = [];

  if (query) {
    cases = await searchCases(session.accessToken, query);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Search Cases</h1>

      <div className="mb-8">
        <SearchBar placeholder="Search case name..." />
      </div>

      {query ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Search Results for "{query}"
          </h2>
          <CaseList cases={cases} />
        </div>
      ) : (
        <p className="text-gray-500">
          Enter a case name to search your Google Drive folders
        </p>
      )}
    </div>
  );
}

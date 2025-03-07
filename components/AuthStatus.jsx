// components/AuthStatus.jsx
"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="mb-4 text-gray-700">
          Sign in with your Google account to access your cases and notes
        </p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-green-600 mb-4">Signed in as {session.user.email}</p>
      <Link
        href="/cases"
        className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        View My Cases
      </Link>
    </div>
  );
}

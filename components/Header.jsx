// components/Header.jsx
"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Legal Case Notes
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/cases" className="hover:underline">
                Cases
              </Link>
            </li>
            {session ? (
              <li>
                <button onClick={() => signOut()} className="hover:underline">
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => signIn("google")}
                  className="hover:underline"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

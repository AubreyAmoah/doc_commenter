// app/layout.jsx
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Legal Case Notes",
  description: "Digital case notes and reminders for law firm cases",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main className="container mx-auto p-4 mt-4">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}

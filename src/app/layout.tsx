import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Jude Emergency Department - Triage & Patient Management",
  description: "Hospital Emergency Patient Management System using Priority Queue, BST, Queue, and Linked List",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

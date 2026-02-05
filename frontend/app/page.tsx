"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/notes");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          📒 Notes & 🔖 Bookmarks Manager
        </h1>

        <p className="text-gray-600 mb-6">
          Manage your personal notes and bookmarks securely with tags,
          favorites, and search.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

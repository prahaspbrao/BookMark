"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">
          Notes & Bookmarks
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/notes" className="text-gray-700 hover:text-blue-600">
            Notes
          </Link>
          <Link href="/bookmarks" className="text-gray-700 hover:text-blue-600">
            Bookmarks
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/notes");
    }
  }, [router]);

  return (
    <div className="home-container">
      <div className="home-card">
        {/* LEFT SECTION */}
        <div className="home-left">
          <h1 className="home-title">
            Organize your <span>notes</span> and <span>bookmarks</span>
          </h1>

          <p className="home-description">
            A secure personal workspace to save notes, manage bookmarks,
            filter by tags, mark favorites, and access everything from anywhere.
          </p>

          <div className="home-actions">
            <Link href="/login" className="btn primary">
              Login
            </Link>

            <Link href="/register" className="btn secondary">
              Create Account
            </Link>
          </div>

          <p className="home-footer">
            Built with Next.js, JWT Authentication & MongoDB
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="home-right">
          <h2>Why use this app?</h2>
          <ul>
            <li>✔ Secure login with JWT</li>
            <li>✔ Notes & bookmarks per user</li>
            <li>✔ Tag-based filtering & search</li>
            <li>✔ Favorites for quick access</li>
            <li>✔ Clean & responsive UI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

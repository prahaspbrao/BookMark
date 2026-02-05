"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const fetchBookmarks = async () => {
    const res = await fetch(`${API_URL}?q=${search}`);
    const data = await res.json();
    setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [search]);

  const createBookmark = async (e) => {
    e.preventDefault();
    if (!url) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title, description }),
    });

    setUrl("");
    setTitle("");
    setDescription("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBookmarks();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search bookmarks..."
        className="w-full p-2 mb-4 rounded border"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Create Bookmark */}
      <form onSubmit={createBookmark} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="url"
          placeholder="URL (required)"
          className="w-full p-2 mb-2 border rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Title (optional – auto fetched)"
          className="w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add Bookmark
        </button>
      </form>

      {/* Bookmarks List */}
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <a
                href={bookmark.url}
                target="_blank"
                className="font-semibold text-blue-600 underline"
              >
                {bookmark.title}
              </a>
              <p className="text-sm text-gray-600">
                {bookmark.description}
              </p>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

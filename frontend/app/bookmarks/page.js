"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchBookmarks = async () => {
    let url = `${API_URL}?q=${search}`;
    if (tagFilter) url += `&tags=${tagFilter}`;

    const res = await fetch(url);
    const data = await res.json();
    setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [search, tagFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    const payload = {
      url,
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
    };

    if (editId) {
      // UPDATE
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // CREATE
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    fetchBookmarks();
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setTags("");
    setEditId(null);
  };

  const startEdit = (bookmark) => {
    setUrl(bookmark.url);
    setTitle(bookmark.title || "");
    setDescription(bookmark.description || "");
    setTags(bookmark.tags.join(","));
    setEditId(bookmark._id);
  };

  const deleteBookmark = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBookmarks();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search bookmarks..."
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by tag"
          className="w-40 p-2 border rounded"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
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

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 mb-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            {editId ? "Update Bookmark" : "Add Bookmark"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Bookmarks List */}
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="bg-white p-4 rounded shadow">
            <a
              href={bookmark.url}
              target="_blank"
              className="font-semibold text-blue-600 underline"
            >
              {bookmark.title}
            </a>

            <p className="text-sm text-gray-600">{bookmark.description}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {bookmark.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-3 text-sm">
              <button
                onClick={() => startEdit(bookmark)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBookmark(bookmark._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

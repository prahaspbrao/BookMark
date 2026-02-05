"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useRouter } from "next/navigation";
import "./page.css";

const API_URL = "http://localhost:5000/api/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchBookmarks = async () => {
    try {
      let url = `${API_URL}?q=${search}`;
      if (tagFilter) url += `&tags=${tagFilter}`;

      const res = await authFetch(url);
      if (!res.ok) {
        setBookmarks([]);
        return;
      }

      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (error) {
      setBookmarks([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
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
      await authFetch(`${API_URL}/${editId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await authFetch(API_URL, {
        method: "POST",
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
    await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBookmarks();
  };

  const toggleFavorite = async (bookmark) => {
    await authFetch(`${API_URL}/${bookmark._id}`, {
      method: "PUT",
      body: JSON.stringify({ favorite: !bookmark.favorite }),
    });
    fetchBookmarks();
  };

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <h1>Bookmarks</h1>
        <p>Save and manage your important links</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bookmark-form">
        <input
          type="url"
          placeholder="Bookmark URL (required)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="form-actions">
          <button type="submit">
            {editId ? "Update Bookmark" : "Add Bookmark"}
          </button>
          {editId && (
            <button type="button" className="cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bookmarks-grid">
        {Array.isArray(bookmarks) &&
          bookmarks.map((bookmark) => (
            <div className="bookmark-card" key={bookmark._id}>
              <a href={bookmark.url} target="_blank">
                {bookmark.title}
              </a>

              <p>{bookmark.description}</p>

              <div className="tags">
                {bookmark.tags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>

              <div className="card-actions">
                <button
                  className={`star ${
                    bookmark.favorite ? "active" : ""
                  }`}
                  onClick={() => toggleFavorite(bookmark)}
                >
                  ★
                </button>
                <button onClick={() => startEdit(bookmark)}>Edit</button>
                <button className="danger" onClick={() => deleteBookmark(bookmark._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

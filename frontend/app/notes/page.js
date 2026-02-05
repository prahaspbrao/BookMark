"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useRouter } from "next/navigation";
import "./page.css";

const API_URL = "http://localhost:5000/api/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    try {
      let url = `${API_URL}?q=${search}`;
      if (tagFilter) url += `&tags=${tagFilter}`;

      const res = await authFetch(url);
      if (!res.ok) {
        setNotes([]);
        return;
      }

      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setNotes([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchNotes();
  }, [search, tagFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      title,
      content,
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
    fetchNotes();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setEditId(null);
  };

  const startEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(","));
    setEditId(note._id);
  };

  const deleteNote = async (id) => {
    await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const toggleFavorite = async (note) => {
    await authFetch(`${API_URL}/${note._id}`, {
      method: "PUT",
      body: JSON.stringify({ favorite: !note.favorite }),
    });
    fetchNotes();
  };

  return (
    <div className="notes-page">
      <div className="page-header">
        <h1>Notes</h1>
        <p>Create, edit, and organize your notes</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          placeholder="Search notes..."
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
      <form onSubmit={handleSubmit} className="note-form">
        <input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="form-actions">
          <button type="submit">
            {editId ? "Update Note" : "Add Note"}
          </button>
          {editId && (
            <button type="button" className="cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes Grid */}
      <div className="notes-grid">
        {Array.isArray(notes) &&
          notes.map((note) => (
            <div className="note-card" key={note._id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>

              <div className="tags">
                {note.tags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>

              <div className="card-actions">
                <button
                  className={`star ${note.favorite ? "active" : ""}`}
                  onClick={() => toggleFavorite(note)}
                >
                  ★
                </button>
                <button onClick={() => startEdit(note)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => deleteNote(note._id)}
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

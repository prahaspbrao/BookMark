"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    let url = `${API_URL}?q=${search}`;
    if (tagFilter) url += `&tags=${tagFilter}`;

    const res = await fetch(url);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
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
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const toggleFavorite = async (note) => {
    await fetch(`${API_URL}/${note._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !note.favorite }),
    });
    fetchNotes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search notes..."
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className="w-full p-2 mb-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 mb-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update Note" : "Add Note"}
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

      {/* Notes List */}
      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-600">{note.content}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-3 items-center text-sm">
              <button
                onClick={() => toggleFavorite(note)}
                className={`text-lg ${
                  note.favorite ? "text-yellow-500" : "text-gray-400"
                }`}
                title="Toggle favorite"
              >
                ★
              </button>

              <button onClick={() => startEdit(note)} className="text-blue-600">
                Edit
              </button>

              <button
                onClick={() => deleteNote(note._id)}
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

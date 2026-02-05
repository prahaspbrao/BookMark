"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    const res = await fetch(`${API_URL}?q=${search}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const createNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full p-2 mb-4 rounded border"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Create Note */}
      <form onSubmit={createNote} className="bg-white p-4 rounded shadow mb-6">
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

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Note
        </button>
      </form>

      {/* Notes List */}
      <div className="grid gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-600">{note.content}</p>
            </div>

            <button
              onClick={() => deleteNote(note._id)}
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

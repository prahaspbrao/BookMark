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

  const fetchNotes = async () => {
    let url = `${API_URL}?q=${search}`;
    if (tagFilter) {
      url += `&tags=${tagFilter}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, [search, tagFilter]);

  const createNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map((t) => t.trim()),
      }),
    });

    setTitle("");
    setContent("");
    setTags("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      {/* Search & Tag Filter */}
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

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 mb-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-600">{note.content}</p>

            {/* Tags */}
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

            <button
              onClick={() => deleteNote(note._id)}
              className="text-red-500 text-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

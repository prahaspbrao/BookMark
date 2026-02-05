const BASE_URL = "http://localhost:5000/api";

export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  return res.json();
};

export const fetchBookmarks = async () => {
  const res = await fetch(`${BASE_URL}/bookmarks`);
  return res.json();
};

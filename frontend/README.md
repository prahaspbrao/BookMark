# Personal Notes & Bookmark Manager – Frontend

This is the frontend application for the Personal Notes & Bookmark Manager.
It provides a responsive UI to manage notes and bookmarks using the backend REST APIs.

---

## 🛠 Tech Stack
- Next.js (App Router)
- React (JavaScript)
- Tailwind CSS

---

## 📂 Project Structure

frontend/
├── app/
│ ├── notes/
│ ├── bookmarks/
│ └── layout.js
├── lib/
│ └── api.js
├── public/
└── package.json

---

## ⚙️ Setup Instructions

### 1. Install dependencies
npm install

### 2. Start the development server
npm run dev

Frontend runs at:
http://localhost:3000

⚠️ Make sure the backend server is running at:
http://localhost:5000

---

## 📄 Pages

### `/notes`
- Create, edit, delete notes
- Search notes by text
- Filter notes by tags
- View tags associated with notes

### `/bookmarks`
- Create, edit, delete bookmarks
- Auto-fetch title from URL if not provided
- Search bookmarks by text
- Filter bookmarks by tags

---

## 🎨 UI Features
- Responsive layout using Tailwind CSS
- Clean and minimal design
- Real-time updates after CRUD operations

---

## 🚀 Future Improvements
- Authentication with JWT
- Favorites for notes and bookmarks
- Pagination and sorting

# Personal Notes & Bookmark Manager – Backend

This is the backend service for the Personal Notes & Bookmark Manager application.
It provides REST APIs for managing notes and bookmarks with search, tagging, and validation.

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## 📂 Project Structure

backend/
├── src/
│ ├── config/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── utils/
│ └── app.js
├── server.js
├── .env
└── package.json

---

## ⚙️ Setup Instructions

### 1. Install dependencies
npm install

### 2. Configure environment variables
Create a `.env` file:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notes_bookmarks_db

### 3. Start the server
npm run dev
Server runs at: http://localhost:5000


---

## 📌 API Documentation

### Notes API

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/notes | Create a note |
| GET | /api/notes | Get notes (search & filter) |
| GET | /api/notes/:id | Get note by ID |
| PUT | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |

Query parameters: /api/notes?q=searchText&tags=tag1,tag2

---

### Bookmarks API

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/bookmarks | Create a bookmark |
| GET | /api/bookmarks | Get bookmarks |
| GET | /api/bookmarks/:id | Get bookmark by ID |
| PUT | /api/bookmarks/:id | Update bookmark |
| DELETE | /api/bookmarks/:id | Delete bookmark |

Query parameters: /api/bookmarks?q=searchText&tags=tag1,tag2

---

## ⭐ Bonus Features
- Auto-fetch bookmark title if not provided
- URL validation
- Search & tag filtering

---

## 🚀 Future Improvements
- User authentication (JWT)
- Favorites support
- Pagination




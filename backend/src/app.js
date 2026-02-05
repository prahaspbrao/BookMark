const express = require("express");
const cors = require("cors");

const noteRoutes = require("./routes/note.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", noteRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;

const Bookmark = require("../models/Bookmark");
const fetchTitle = require("../utils/fetchTitle");
const { isValidUrl } = require("../utils/isValidUrl");

// =======================
// CREATE BOOKMARK
// =======================
exports.createBookmark = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    let finalTitle = title;
    if (!title) {
      finalTitle = await fetchTitle(url);
    }

    const bookmark = await Bookmark.create({
      ...req.body,
      title: finalTitle,
      user: req.user, // 👈 important
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =======================
// GET ALL BOOKMARKS (user-specific + search + tags)
// =======================
exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;

    let filter = { user: req.user }; // 👈 user isolation

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET BOOKMARK BY ID (ownership check)
// =======================
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// =======================
// UPDATE BOOKMARK (ownership check)
// =======================
exports.updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "Bookmark not found or unauthorized" });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =======================
// DELETE BOOKMARK (ownership check)
// =======================
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "Bookmark not found or unauthorized" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

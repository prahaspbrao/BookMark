const Bookmark = require("../models/Bookmark");
const fetchTitle = require("../utils/fetchTitle");
const { isValidUrl } = require("../utils/isValidUrl");

// CREATE BOOKMARK
exports.createBookmark = async (req, res) => {
  try {
    const { title, url } = req.body;

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
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL BOOKMARKS (search + tags)
exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = {};

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

// GET BOOKMARK BY ID
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json(bookmark);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// UPDATE BOOKMARK
exports.updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE BOOKMARK
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json({ message: "Bookmark deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

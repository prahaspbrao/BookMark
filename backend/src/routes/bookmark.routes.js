const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmark.controller");

router.post("/", bookmarkController.createBookmark);
router.get("/", bookmarkController.getBookmarks);
router.get("/:id", bookmarkController.getBookmarkById);
router.put("/:id", bookmarkController.updateBookmark);
router.delete("/:id", bookmarkController.deleteBookmark);

module.exports = router;

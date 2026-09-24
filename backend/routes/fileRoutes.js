const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const { uploadFile } = require("../controllers/fileController");

const router = express.Router();

// Upload file API
router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

module.exports = router;
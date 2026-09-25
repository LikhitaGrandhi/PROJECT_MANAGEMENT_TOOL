const express = require("express");

const { getAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get project and task analytics
router.get("/", protect, getAnalytics);

module.exports = router;
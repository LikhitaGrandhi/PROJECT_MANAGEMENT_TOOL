const express = require("express");

const {
    getGithubRepository
} = require("../controllers/githubController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getGithubRepository);

module.exports = router;
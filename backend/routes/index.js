const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Project Management Tool API is working!"
    });
});

router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend server is healthy"
    });
});

module.exports = router;
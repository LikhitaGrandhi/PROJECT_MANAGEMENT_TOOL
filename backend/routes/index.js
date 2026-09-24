const express = require("express");

const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

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

// Authentication routes
router.use("/auth", authRoutes);

// Project routes
router.use("/projects", projectRoutes);
// task route
router.use("/tasks", taskRoutes);

module.exports = router;
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const initSocket = require("./sockets/socket");
const fileRoutes = require("./routes/fileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

// Create Express app
const app = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initSocket(httpServer);

// Make Socket.io available to controllers
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// File upload API
app.use("/api/files", fileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);


// Basic test route
app.get("/", (req, res) => {
  res.send("Project Management Tool Backend is running!");
});

// Server port
const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
  try {
    // Try connecting to MongoDB
    try {
      await connectDB();
    } catch (dbError) {
      console.error(
        "MongoDB connection failed:",
        dbError.message
      );

      console.log(
        "Starting server for Socket.io and file upload testing."
      );
    }

    // Start Express and Socket.io
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error.message);
  }
};

// Handle Socket.io connections through this server
startServer();
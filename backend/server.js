const express = require("express");
const cors = require("cors");
require("dotenv").config();
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env file");
    process.exit(1);
}

if (!process.env.PORT) {
    console.warn("PORT is not defined. Using default port 5000.");
}

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const apiRoutes = require("./routes");
const errorHandler = require("./middleware/errorMiddleware");
const notFound = require("./middleware/notFound");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api", apiRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Project Management Tool Backend is running!"
    });
});
// 404 middleware
app.use(notFound);
// Error handling middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
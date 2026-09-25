const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    let attempts = 0;

    while (attempts < 5) {
        try {
            attempts++;

            console.log(`MongoDB connection attempt ${attempts}/5...`);

            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 20000,
                family: 4
            });

            console.log("MongoDB connected successfully");
            return;

        } catch (error) {
            console.error(
                `MongoDB connection failed (attempt ${attempts}/5):`,
                error.message
            );

            if (attempts < 5) {
                console.log("Retrying MongoDB connection in 3 seconds...");
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    console.error("MongoDB connection failed after 5 attempts.");
};

module.exports = connectDB;
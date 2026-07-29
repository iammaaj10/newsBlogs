import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseconnection = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("❌ MONGO_URI is missing in environment variables.");
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connected to MongoDB successfully.");
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
    }
};

export default databaseconnection;

import mongoose from "mongoose";
import dotenv from "dotenv";
import removeUnusedIndexes from "./removeUnusedIndexes.js"; // Adjust path as necessary

dotenv.config({
    path: "./config/.env"
});

const databaseconnection = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log("Connected to MongoDB");
            await removeUnusedIndexes(); // Call it here to remove the index once
        })
        .catch((error) => {
            console.log("Database connection error:", error);
        });
};

export default databaseconnection;

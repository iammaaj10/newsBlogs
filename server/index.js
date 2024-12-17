import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/Database.js";
import blogsRoute from "./routes/blogsRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"; 
import cors from "cors";

dotenv.config({
    path: ".env"
});
databaseconnection();

//middlewares
const app = express();

// CORS Middleware should be placed before your routes
const corsOptions = {
    origin: "http://localhost:5173", // Frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Define your routes after applying CORS middleware
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogsRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

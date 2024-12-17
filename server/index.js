import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/Database.js";
import blogsRoute from "./routes/blogsRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"; 
import cors from "cors"
import multer from "multer";

dotenv.config({
    path: ".env"
});
databaseconnection();


//middlewares
const app = express();
app.use(express.urlencoded({
     extended: true 
    })); 
app.use(express.json());
app.use(cookieParser()); 

const corsOptions={
    origin :"http://localhost:5173",
    credentials:true
}

app.use(cors(corsOptions))


app.use("/api/v1/user",userRoute)
app.use("/api/v1/blog", blogsRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

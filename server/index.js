// server.js - Optimized Socket Setup
import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/Database.js";
import blogsRoute from "./routes/blogsRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import aiRoutes from "./routes/ai.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config({ path: ".env" });

databaseconnection();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store user socket mappings
const userSocketMap = new Map();

// Make io available to routes
app.set('io', io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogsRoute);
app.use("/api/ai", aiRoutes);

// Socket connection handling
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Handle user joining
  socket.on("join", (userId) => {
    if (!userId) return;
    
    // Leave previous room if exists
    if (socket.userId) {
      socket.leave(socket.userId);
      userSocketMap.delete(socket.userId);
    }
    
    // Join new room
    socket.userId = userId;
    socket.join(userId);
    userSocketMap.set(userId, socket.id);
    
    console.log(`✅ User ${userId} joined room with socket ${socket.id}`);
    
    // Confirm connection
    socket.emit('joined', { userId, socketId: socket.id });
  });

  // Handle real-time like updates
  socket.on("likeUpdate", (data) => {
    console.log("👍 Like update received:", data);
    
    // Broadcast to all users except sender
    socket.broadcast.emit("likeUpdate", {
      blogId: data.blogId,
      userId: data.userId,
      liked: data.liked,
      likesCount: data.likesCount,
      likedUsers: data.likedUsers
    });
    
    // Send to specific blog owner if different from liker
    if (data.blogOwnerId && data.blogOwnerId !== data.userId) {
      socket.to(data.blogOwnerId).emit("likeUpdate", data);
    }
  });

  // Handle real-time comment updates
  socket.on("commentUpdate", (data) => {
    console.log("💬 Comment update received:", data);
    
    // Broadcast to all users except sender
    socket.broadcast.emit("commentUpdate", {
      blogId: data.blogId,
      comment: data.comment
    });
    
    // Send to specific blog owner if different from commenter
    if (data.blogOwnerId && data.blogOwnerId !== data.comment.postedby._id) {
      socket.to(data.blogOwnerId).emit("commentUpdate", data);
    }
  });

  // Handle notifications
  socket.on("notification", (data) => {
    console.log("🔔 Notification:", data);
    
    if (data.toUserId && userSocketMap.has(data.toUserId)) {
      const targetSocketId = userSocketMap.get(data.toUserId);
      io.to(targetSocketId).emit("receiveNotification", data);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      socket.leave(socket.userId);
    }
  });
});

// Global helper function for notifications
global.emitNotification = (toUserId, notificationData) => {
  if (userSocketMap.has(toUserId)) {
    const socketId = userSocketMap.get(toUserId);
    io.to(socketId).emit("receiveNotification", notificationData);
  }
};

// Export for use in routes
export { io, userSocketMap };

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server started on port ${process.env.PORT}`);
});
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

// Connect to database
databaseconnection();

const app = express();
const server = http.createServer(app);

// CORS configuration for Express
const corsOptions = {
  origin: "http://localhost:5173",  // Specific origin for frontend
  credentials: true,                // Allow credentials (cookies, headers)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

// Socket.IO server setup with specific CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Frontend URL
    methods: ["GET", "POST"],        // Allowed methods
    credentials: true                // Allow credentials (cookies, headers)
  }
});

// Store user socket mappings
const userSocketMap = new Map();

// Make io accessible to routes
app.set('io', io);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogsRoute);
app.use("/api/ai", aiRoutes);

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining with their ID
  socket.on("join", (userId) => {
    userSocketMap.set(userId, socket.id);
    socket.userId = userId;
    socket.join(userId); // Join a room with their user ID
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Listen for notification events from clients
  socket.on("notification", (data) => {
    console.log("Notification Data:", data);
    // Send notification to all other connected clients (excluding sender)
    socket.broadcast.emit("receive-notification", data);
  });

  // Listen for new notifications from backend
  socket.on("newNotification", (data) => {
    console.log("New notification:", data);
    // Emit to specific user if they're online
    if (data.toUserId && userSocketMap.has(data.toUserId)) {
      const targetSocketId = userSocketMap.get(data.toUserId);
      io.to(targetSocketId).emit("receiveNotification", data);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from mapping
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
    }
  });
});

// Helper function to emit notifications (accessible globally)
const emitNotification = (toUserId, notificationData) => {
  if (userSocketMap.has(toUserId)) {
    const socketId = userSocketMap.get(toUserId);
    io.to(socketId).emit("receiveNotification", notificationData);
  }
};

// Make emitNotification available globally
global.emitNotification = emitNotification;

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
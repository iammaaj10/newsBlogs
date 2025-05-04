import express from "express";
import { Bookmarks, follower, getOtherUsers, Logout, profile, Register, unfollow ,updateProfile  ,getNotifications, createNotification, cleanupNotifications,getBookmarkedBlogs } from "../controllers/userControllers.js";
import { Login } from "../controllers/userControllers.js";
import isAuthenticated from "../config/Auth.js";

const router = express.Router();

router.post("/register", Register); 
router.post("/login", Login); 
router.get("/logout",Logout)
router.route("/bookmark/:id").put(isAuthenticated,Bookmarks)
router.get('/bookmarks/:id', getBookmarkedBlogs);

router.route("/profile/:id").get(isAuthenticated,profile)
router.route("/otheruser/:id").get(isAuthenticated,getOtherUsers)
router.route("/follower/:id").post(isAuthenticated,follower)
router.route("/unfollow/:id").post(isAuthenticated,unfollow)
router.route("/updateprofile/:id").put(updateProfile)
//router.route("/ask").post(askAI)
router.route('/notifications')
  .get( getNotifications) // Get all notifications for the user
  .post( createNotification); // Create a new notification

router.route('/notifications/:id')
  .get( getNotifications); // Get notifications by user ID

router.route('/cleanup-notifications')
  .delete( cleanupNotifications); // Cleanup old notifications


export default router;



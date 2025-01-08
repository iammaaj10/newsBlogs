import express from "express";
import { Bookmarks, follower, getOtherUsers, Logout, profile, Register, unfollow ,updateProfile  ,askAI, getNotifications, createNotification, cleanupNotifications} from "../controllers/userControllers.js";
import { Login } from "../controllers/userControllers.js";
import isAuthenticated from "../config/Auth.js";

const router = express.Router();

router.post("/register", Register); 
router.post("/login", Login); 
router.get("/logout",Logout)
router.route("/bookmark/:id").put(isAuthenticated,Bookmarks)
router.route("/profile/:id").get(isAuthenticated,profile)
router.route("/otheruser/:id").get(isAuthenticated,getOtherUsers)
router.route("/follower/:id").post(isAuthenticated,follower)
router.route("/unfollow/:id").post(isAuthenticated,unfollow)
router.route("/updateprofile/:id").put(updateProfile)
router.route("/ask").post(askAI)
router.route('/notifications')
  .get(isAuthenticated, getNotifications) // Get all notifications for the user
  .post(isAuthenticated, createNotification); // Create a new notification

router.route('/notifications/:id')
  .get(isAuthenticated, getNotifications); // Get notifications by user ID

router.route('/cleanup-notifications')
  .delete(isAuthenticated, cleanupNotifications); // Cleanup old notifications


export default router;



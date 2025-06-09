import express from "express";
import { Bookmarks, follower, getOtherUsers, Logout, profile, Register, unfollow ,updateProfile  ,getBookmarkedBlogs ,getNotifications } from "../controllers/userControllers.js";
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

router.get('/notifications/:userId', getNotifications);
//router.route("/ask").post(askAI)



export default router;



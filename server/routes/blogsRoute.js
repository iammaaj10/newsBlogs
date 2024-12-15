import express from "express";
import { Createblog, deleteBlog, getAllBlogs, getFollowingBlogs, likeAnddislike ,addComment,getBlogById } from "../controllers/blogsControllers.js";
import isAuthenticated from "../config/Auth.js";

const router = express.Router();


router.route("/create").post(isAuthenticated,Createblog);
router.route("/create").post(isAuthenticated,Createblog);
router.route("/delete/:id").delete(isAuthenticated,deleteBlog)
router.route("/likes/:id").put(isAuthenticated,likeAnddislike)
router.route("/getallblogs/:id").get(isAuthenticated,getAllBlogs)
router.route("/getfollowingblog/:id").get(isAuthenticated,getFollowingBlogs)
 router.route("/addComment/:id").put(isAuthenticated,addComment)
 router.route("/getBlogById/:id").get(getBlogById)

export default router;

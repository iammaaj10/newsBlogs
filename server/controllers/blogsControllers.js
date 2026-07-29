import { Blog } from "../models/blogsSchema.js";
import { User } from "../models/userSchema.js";

export const Createblog = async (req, res) => {
    try {
        const { description, id, image } = req.body;

        if (!description && !image) {
            return res.status(400).json({
                message: "Please provide at least a description or an image",
                success: false,
            });
        }

        const user = await User.findById(id);

        const newBlog = await Blog.create({
            description: description || "", 
            image: image || "", 
            userid: id,
            userDetails: [user],
        });

        return res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while creating the blog",
            success: false,
        });
    }
};




export const  deleteBlog = async (req,res)=>{
       try {

           const {id} = req.params
           await Blog.findByIdAndDelete(id)
           return res.status(200).json({
            message:"Blog deleted successfully",
            success:true
           })
        
       } catch (error) {
        console.log(error);
        
       }
}

    export const likeAnddislike = async (req, res) => {
    try {
        const loggedInUser = req.body.id; 
        const blogId = req.params.id; 
    
        if (!loggedInUser || !blogId) {
            return res.status(400).json({
                message: "Invalid request. Missing required parameters.",
                success: false,
            });
        }
    
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false,
            });
        }
    
        const isLiked = blog.likes.some((id) => id.toString() === loggedInUser.toString());
    
        if (isLiked) {
            blog.likes = blog.likes.filter((id) => id.toString() !== loggedInUser.toString());
            await blog.save();
            return res.status(200).json({
                message: "Post unliked",
                success: true,
                updatedlikes: blog.likes, 
            });
        } else {
            blog.likes.push(loggedInUser);
            await blog.save();
            return res.status(200).json({
                message: "Post liked",
                success: true,
                updatedlikes: blog.likes, 
            });
        }
    } catch (error) {
        console.error("Error in likeAnddislike function:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const loggedInUserBlogs = await Blog.find({ userid: id }).populate("comments.postedby", "name username profilePic");

        const followingUserBlogs = await Promise.all(
            (loggedInUser.following || []).map((otherUserId) => {
                return Blog.find({ userid: otherUserId }).populate("comments.postedby", "name username profilePic");
            })
        );

        const allBlogs = loggedInUserBlogs.concat(...followingUserBlogs);
        allBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({
            blogs: allBlogs,
            success: true
        });
    } catch (error) {
        console.error("Error in getAllBlogs function:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getFollowingBlogs = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const followingUserBlogs = await Promise.all(
            (loggedInUser.following || []).map((otherUserId) => {
                return Blog.find({ userid: otherUserId }).populate("comments.postedby", "name username profilePic");
            })
        );

        const blogs = [].concat(...followingUserBlogs);
        blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({
            blogs,
            success: true
        });
    } catch (error) {
        console.error("Error in getFollowingBlogs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const addComment = async (req, res) => {
    try {
      const { text, id } = req.body; 
      const blogId = req.params.id; 
    
      if (!text || !id) {
        return res.status(400).json({
          message: "Comment text and user ID are required",
          success: false,
        });
      }
    
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
          success: false,
        });
      }
    
      const commenter = await User.findById(id).select("name username profilePic");

      const comment = {
        text,
        postedby: commenter?._id || id,
      };

      blog.comments.push(comment);
      await blog.save();
    
      const updatedBlog = await Blog.findById(blogId).populate("comments.postedby", "name username profilePic");

      return res.status(200).json({
        message: "Comment added successfully",
        blog: updatedBlog,
        success: true,
      });
    } catch (error) {
      console.error("Error in addComment:", error.message);
      return res.status(500).json({
        message: "An error occurred while adding the comment",
        success: false,
      });
    }
};
  
  export const getBlogById = async (req, res) => {
    try {
      const blogId = req.params.id;
  
      // Validate blog ID format
      if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "Invalid blog ID",
          success: false,
        });
      }
  
      // Fetch the blog with populated comments
      const blog = await Blog.findById(blogId).populate(
        "comments.postedby",
        "name email"
      );
  
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
          success: false,
        });
      }
  
      res.status(200).json({
        blog,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching blog:", error.message);
      res.status(500).json({
        message: "An error occurred while fetching the blog",
        success: false,
      });
    }
  };
  
  
  
  
  
  
  


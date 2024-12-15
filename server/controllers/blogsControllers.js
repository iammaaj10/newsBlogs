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
            userDetails: user,
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
    
        
        if (blog.likes.includes(loggedInUser)) {
            await Blog.findByIdAndUpdate(blogId, { $pull: { likes: loggedInUser } });
            blog.likes = blog.likes.filter((id) => id !== loggedInUser);
            return res.status(200).json({
                message: "You disliked the blog post",
                success: true,
                updatedlikes: blog.likes, 
            });
        } else {
            await Blog.findByIdAndUpdate(blogId, { $push: { likes: loggedInUser } });
            blog.likes.push(loggedInUser);
            return res.status(200).json({
                message: "You liked the blog post",
                success: true,
                updatedlikes: blog.likes, 
            });
        }
        
        } catch (error) {
        console.error("Error in likeAndDislike function:", error);
    
        
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

       
        const loggedInUserBlogs = await Blog.find({ userid: id });

        
        const followingUserBlogs = await Promise.all(
            loggedInUser.following.map((otherUserId) => {
                return Blog.find({ userid: otherUserId });
            })
        );

        return res.status(200).json({
            blogs: loggedInUserBlogs.concat(...followingUserBlogs),
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

export const getFollowingBlogs = async (req,res) => {
    try {

        const id = req.params.id;
        const loggedInUser = await User.findById(id);
       const followingUserBlogs = await Promise.all(
            loggedInUser.following.map((otherUserId) => {
                return Blog.find({ userid: otherUserId });
            })
        );

        return res.status(200).json({
            blogs: [].concat(...followingUserBlogs),
            success: true
        });
        
    } catch (error) {
        console.log(error);
        
    }
}


export const addComment = async (req, res) => {
    try {
      const { text, id } = req.body; 
      const blogId = req.params.id; 
    
      // Validate input
      if (!text || !id) {
        return res.status(400).json({
          message: "Comment text and user ID are required",
          success: false,
        });
      }
    
      // Validate blog ID and user ID formats
      if (!blogId.match(/^[0-9a-fA-F]{24}$/) || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "Invalid blog or user ID",
          success: false,
        });
      }
    
      // Find the blog by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
          success: false,
        });
      }
    
      // Add the comment
      const comment = { text, postedby: id };
      blog.comments.push(comment);
      await blog.save();
    
      // Fetch the updated blog with populated comments
      const updatedBlog = await Blog.findById(blogId).populate(
        "comments.postedby",
        "name email"
      );
    
      // Return the updated blog with populated comments
      res.status(200).json({
        message: "Comment added successfully",
        blog: updatedBlog, // Includes populated comments
        success: true,
      });
    } catch (error) {
      console.error("Error in addComment:", error.message);
      res.status(500).json({
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
  
  
  
  
  
  
  


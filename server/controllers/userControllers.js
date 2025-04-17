import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blogsSchema.js";
import axios from "axios";
import mongoose from "mongoose";
import { Notification } from "../models/notificationSchema.js";


export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Email already exists",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in Register function:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields",
                success: false
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                message: "User not found!!!",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        return res
            .status(201)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            .json({
                message: `Welcome back ${user.name}`,
                user,
                success: true
            });

    } catch (error) {
        console.error("Error in Login function:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const Logout =(req,res)=>{
    return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({
        message: "Logged out successfully",
        success:true
    })
}
export const Bookmarks = async (req, res) => {
    try {
        const loggedInUser = req.body.id;
        const blogid = req.params.id;

        const user = await User.findById(loggedInUser);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (user.Bookmarks.includes(blogid)) {
           
            await User.findByIdAndUpdate(loggedInUser, { $pull: { Bookmarks: blogid } });
            user.Bookmarks = user.Bookmarks.filter((id) => id !== blogid);
            return res.status(200).json({
                message: "Removed from bookmarks",
                success: true,
                updatedBookmarks: user.Bookmarks, 
            });
        } else {
           
            await User.findByIdAndUpdate(loggedInUser, { $push: { Bookmarks: blogid } });
            user.Bookmarks.push(blogid);
            return res.status(200).json({
                message: "Added to bookmarks",
                success: true,
                updatedBookmarks: user.Bookmarks, 
            });
        }
    } catch (error) {
        console.error("Error in Bookmarks function:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// GET bookmarked blogs of a user
export const getBookmarkedBlogs = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('Bookmarks');

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({
          success: true,
          bookmarks: user.Bookmarks, // this will return array of blog objects
      });
  } catch (err) {
      console.error("Error fetching bookmarks:", err);
      res.status(500).json({ success: false, message: "Server error" });
  }
};



   export const profile = async (req, res) => {
    try {
        const profileId = req.params.id;

        if (!profileId) {
            return res.status(400).json({
                message: "Profile ID is required",
                success: false
            });
        }

        const user = await User.findById(profileId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getOtherUsers = async (req,res) => {
    try {
        const {id} = req.params;
        const otherUsers = await User.find({_id:{$ne:id}}).select("-password")
        if(!otherUsers)
        {
            return res.status(401).json({
                message: "No other users found",
                success:false
            })
        }
        else{
            return res.status(200).json({
                otherUsers,
            })
        }

    } catch (error) {
        console.log(error);
        
    }
}

// Add this function to create notifications
const createNotificationHelper = async (type, fromUserId, toUserId, blogId = null) => {
  try {
    // Don't create notification if user is acting on their own content
    if (fromUserId.toString() === toUserId.toString()) {
      return;
    }

    const notification = await Notification.create({
      type,
      fromUser: fromUserId,
      toUser: toUserId,
      blog: blogId,
      createdAt: new Date()
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Modify the follower function to add notification
export const follower = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });

      // Create notification for follow
      await createNotificationHelper('follow', loggedInUserId, userId);

      return res.status(200).json({
        message: `${loggedInUser.name} just followed ${user.name}`,
        success: true
      });
    } else {
      return res.status(400).json({
        message: `You are already following ${user.name}`,
        success: false
      });
    }
  } catch (error) {
    console.error('Error in follower function:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

// Add these functions for like and comment notifications
export const handleLike = async (req, res) => {
  try {
    const { userId, blogId, toUserId } = req.body;
    
    // Don't create notification if user is liking their own blog
    if (userId === toUserId) {
      return res.status(200).json({
        message: 'Self-like, no notification needed',
        success: true
      });
    }

    // Create notification
    await Notification.create({
      type: 'like',
      fromUser: userId,
      toUser: toUserId,
      blog: blogId,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: 'Notification created for like',
      success: true
    });
  } catch (error) {
    console.error('Error in handleLike:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

export const handleComment = async (req, res) => {
  try {
    const { userId, blogId, toUserId, comment } = req.body;
    
    // Don't create notification if user is commenting on their own blog
    if (userId === toUserId) {
      return res.status(200).json({
        message: 'Self-comment, no notification needed',
        success: true
      });
    }

    // Create notification
    await Notification.create({
      type: 'comment',
      fromUser: userId,
      toUser: toUserId,
      blog: blogId,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: 'Notification created for comment',
      success: true
    });
  } catch (error) {
    console.error('Error in handleComment:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

export const unfollow = async (req,res) => {
    
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id

        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if(loggedInUser.following.includes(userId))
        {
            await user.updateOne({$pull:{followers:loggedInUserId}})
            await loggedInUser.updateOne({$pull:{following:userId}})


        }
        else{
            return res.status(400).json({
                message: `Not yet follow the user`,
                
            })
        }
        return res.status(200).json({

            message:`${loggedInUser.name} just unfollow to ${user.name}`
        }

        )
    } catch (error) {
        
    }
}


// Backend
export const updateProfile = async (req, res) => {
    try {
        const { username, about, profilePic } = req.body;
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Update user fields with the provided data
        user.username = username || user.username;
        user.about = about || user.about;

        if (profilePic && profilePic !== user.profilePic) {
            user.profilePic = profilePic; // Assuming you are sending the URL of the profile picture
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user,  // Send updated user data
            success: true
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


// ask ai 


export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
        success: false,
      });
    }

   
    const url = "https://api.gemini.ai/v1/ask";  

    
    const response = await axios.post(
      url, 
      { 
        prompt: prompt 
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,  
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({
      message: "AI response fetched successfully",
      response: response.data,
      success: true,
    });

  } catch (error) {
    console.error("Error in Ask AI controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



// Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log('Fetching notifications for userId:', userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid or missing User ID',
        success: false,
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    const notifications = await Notification.find({ 
      toUser: userId,
      createdAt: { $gt: new Date(Date.now() - 3600000) } // Last hour only
    })
    .populate('fromUser', 'username name profilePic')
    .populate('blog', 'title _id')
    .sort({ createdAt: -1 })
    .lean();

    return res.status(200).json(notifications);
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json([]);
  }
};

// Create Notification
export const createNotification = async (req, res) => {
  try {
    const { toUserId, type, blogId } = req.body;
    const fromUserId = req.user?._id;

    // Validate user authentication
    if (!fromUserId || !mongoose.Types.ObjectId.isValid(fromUserId)) {
      return res.status(401).json({
        message: 'Unauthorized - Invalid or missing user authentication',
        success: false,
      });
    }

    // Validate toUserId
    if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        message: 'Invalid or missing toUserId',
        success: false,
      });
    }

    // Validate blogId if provided
    if (blogId && !mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        message: 'Invalid blogId',
        success: false,
      });
    }

    // Validate notification type
    if (!type || !['like', 'comment', 'follow'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid or missing notification type',
        success: false,
      });
    }

    // Check if the recipient user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: 'Recipient user not found',
        success: false,
      });
    }

    // Skip notification if sender and recipient are the same
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(200).json({
        success: true,
        message: 'Notification skipped - same user',
      });
    }

    // Create notification
    const notification = await Notification.create({
      type,
      fromUser: fromUserId,
      toUser: toUserId,
      blog: blogId,
      createdAt: new Date(),
    });

    // Populate the created notification with user and blog details
    await notification.populate('fromUser', 'username');
    if (blogId) {
      await notification.populate('blog', 'title');
    }

    // Return created notification
    return res.status(201).json({
      success: true,
      notification,
    });

  } catch (error) {
    // Log error details
    console.error('Error creating notification:', error.message);
    console.error(error.stack); // Logs the stack trace for better debugging

    // Return error response
    return res.status(500).json({
      message: 'Error creating notification',
      success: false,
    });
  }
};

// Cleanup notifications older than 1 hour
export const cleanupNotifications = async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 3600000);

    const result = await Notification.deleteMany({
      createdAt: { $lt: oneHourAgo }
    });

    return res.status(200).json({
      success: true,
      message: 'Notifications cleaned up successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cleanup notifications'
    });
  }
};

export const handleFollow = async (req, res) => {
  try {
    const { userId, toUserId } = req.body;
    
    // Don't create notification if user is following themselves
    if (userId === toUserId) {
      return res.status(200).json({
        message: 'Self-follow, no notification needed',
        success: true
      });
    }

    // Create notification
    await Notification.create({
      type: 'follow',
      fromUser: userId,
      toUser: toUserId,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: 'Notification created for follow',
      success: true
    });
  } catch (error) {
    console.error('Error in handleFollow:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

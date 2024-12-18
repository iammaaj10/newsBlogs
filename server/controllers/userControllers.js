import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import  jwt  from "jsonwebtoken";
import { Blog } from "../models/blogsSchema.js";
import multer from "multer"
import path from "path"


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

export const follower  = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id

        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if(!user.followers.includes(loggedInUserId))
        {
            await user.updateOne({$push:{followers:loggedInUserId}})
            await loggedInUser.updateOne({$push:{following:userId}})


        }
        else{
            return res.status(400).json({
                message: `You are already following to ${user.name}`,
                
            })
        }
        return res.status(200).json({

            message:`${loggedInUser.name} just follow to ${user.name}`
        }

        )
    } catch (error) {
        
    }
} 


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

        // Handle profilePic if it's a file upload
        if (profilePic && profilePic !== user.profilePic) {
            user.profilePic = profilePic; // Assuming you are sending the URL of the profile picture
        }

        // Save the updated user document to the database
        await user.save();

        // Send the updated user data in the response
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




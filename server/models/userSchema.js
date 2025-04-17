import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    Bookmarks: {
        type: Array,
        default: []
    },
    Bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }],
    profilePic: {
        type: String, // Path or URL to the uploaded profile picture
        default: ""   // Empty by default
    },
    about: {
        type: String, // Optional "about me" section
        default: ""   // Empty by default
    },
    
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);

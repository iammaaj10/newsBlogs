import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: false
    },
    image :{
        type:String ,
        required:false
    },

    likes: {
        type: Array,
        default: []
    },

    comments: [
        {
          text: String,
          postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    userDetails :{
        type:Array,
        default: []
    }
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogsSchema);

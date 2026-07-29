import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [], 
    refresh: false, 
    isActive: true
  },
  reducers: {
    getAllBlogs: (state, action) => {
      state.blogs = action.payload; 
    },
    addNewBlog: (state, action) => {
      state.blogs = [action.payload, ...state.blogs];
    },
    updatePostLikes: (state, action) => {
      const { blogId, likes } = action.payload;
      const blog = state.blogs.find((b) => b._id === blogId);
      if (blog) {
        blog.likes = likes;
      }
    },
    updatePostComments: (state, action) => {
      const { blogId, comments } = action.payload;
      const blog = state.blogs.find((b) => b._id === blogId);
      if (blog) {
        blog.comments = comments;
      }
    },
    toggleRefresh: (state) => {
      state.refresh = !state.refresh; 
    },
    getisActive: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { getAllBlogs, addNewBlog, updatePostLikes, updatePostComments, toggleRefresh, getisActive } = blogsSlice.actions;
export default blogsSlice.reducer;

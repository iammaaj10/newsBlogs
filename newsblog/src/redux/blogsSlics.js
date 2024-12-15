import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [], 
    refresh: false, 
    isActive : true
  },
  reducers: {
    getAllBlogs: (state, action) => {
      state.blogs = action.payload; 
    },
    toggleRefresh: (state) => {
      state.refresh = !state.refresh; 
    },
    getisActive:(state,action)=>{
      state.isActive = action.payload
    },
    
  },
});

export const { getAllBlogs, toggleRefresh,getisActive } = blogsSlice.actions;
export default blogsSlice.reducer;

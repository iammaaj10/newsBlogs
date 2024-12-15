import { useEffect } from "react";
import axios from "axios";
import { BLOG_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../redux/blogsSlics";

const useGetMyBlogs = (id) => {
  const dispatch = useDispatch();
  const { refresh, isActive } = useSelector((store) => store.blogs);
  const { user } = useSelector((store) => store.user);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BLOG_API_END_POINT}/getallblogs/${id}`, {
        withCredentials: true,
      });
      if (res.data?.blogs) {
        dispatch(getAllBlogs(res.data.blogs));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
    }
  };

  const onFollowingBlogHandler = async () => {
    try {
      const res = await axios.get(`${BLOG_API_END_POINT}/getfollowingblog/${id}`, {
        withCredentials: true,
      });
      if (res.data?.blogs) {
        dispatch(getAllBlogs(res.data.blogs));
      }
    } catch (error) {
      console.error("Error fetching following blogs:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!id) {
      console.warn("User ID is missing; cannot fetch blogs.");
      return;
    }

    if (isActive) {
      fetchBlogs();
    } else {
      onFollowingBlogHandler();
    }
  }, [id, refresh, isActive, user]); 
};

export default useGetMyBlogs;

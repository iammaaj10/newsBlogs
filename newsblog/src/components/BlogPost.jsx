import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { BLOG_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleRefresh } from '../redux/blogsSlics';
import { updateUserBookmarks, updateUsersLikes } from '../redux/userSlice';

const BlogPost = ({ blogs }) => {
  const [isBookmark, setBookmark] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(blogs?.comments || []);
  const { user, profile } = useSelector((store) => store.user); // Include profile from Redux
  const dispatch = useDispatch();

  // Determine if the current user has liked the post
  useEffect(() => {
    setLiked(blogs?.likes?.includes(user?._id));
  }, [blogs?.likes, user?._id]);

  // Determine if the current user has bookmarked the post
  useEffect(() => {
    setBookmark(user?.Bookmarks?.includes(blogs?._id));
  }, [user?.Bookmarks, blogs?._id]);

  // Like/Dislike Handler
  const likeDislikeHandler = async () => {
    try {
      const res = await axios.put(
        `${BLOG_API_END_POINT}/likes/${blogs?._id}`,
        { id: user?._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateUsersLikes(res.data.updatedlikes));
        setLiked((prev) => !prev);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error in like/dislike handler:", error);
      toast.error("An error occurred while liking/disliking.");
    }
  };

  // Bookmark Handler
  const bookmarkHandler = async () => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/bookmark/${blogs?._id}`,
        { id: user?._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setBookmark((prev) => !prev);
        dispatch(updateUserBookmarks(res.data.updatedBookmarks));
        toast.success(res.data.message);
      } else {
        toast.error("Failed to update bookmark.");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("An error occurred.");
    }
  };

  // Delete Post Handler
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${BLOG_API_END_POINT}/delete/${blogs?._id}`, {
        withCredentials: true,
      });
      dispatch(toggleRefresh());
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post.");
    }
  };

  // Post Comment Handler
  const postCommentHandler = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      const res = await axios.put(
        `${BLOG_API_END_POINT}/addComment/${blogs?._id}`,
        { text: commentText, id: user?._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(res.data.blog.comments); // Update comments
        setCommentText("");
        toast.success("Comment added successfully!");
      } else {
        toast.error(res.data.message || "Failed to add comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("An error occurred while adding the comment.");
    }
  };

  // Fetch Blog Comments on Component Mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BLOG_API_END_POINT}/getBlogById/${blogs?._id}`);
        if (res.data.success) {
          setComments(res.data.blog.comments);
        } else {
          toast.error("Failed to fetch blog.");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("An error occurred while fetching the blog.");
      }
    };

    fetchBlog();
  }, [blogs?._id]);

  return (
    <div className="p-2 border-b border-gray-300">
      <div className="flex gap-2">
        <Avatar
          src={
            blogs?.userDetails[0]?._id === user?._id
              ? user?.profilePic || 'https://via.placeholder.com/150' // Logged-in user's profile picture
              : blogs?.userDetails[0]?.profilePic || 'https://via.placeholder.com/150' // Other users' profile pictures
          }
          size="40"
          round={true}
        />
        <div className="w-full">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">{blogs?.userDetails[0]?.name}</h1>
            <p className="text-sm">
              @{
                blogs?.userDetails[0]?._id === user?._id
                  ? (profile?.username || blogs?.userDetails[0]?.username) 
                  : blogs?.userDetails[0]?.username 
              } · 1m
            </p>


          </div>
          <p>{blogs?.description}</p>
          {blogs?.image && (
            <img
              src={blogs?.image}
              alt="Blog"
              className="w-[200px] h-[200px] object-cover rounded-lg"
            />
          )}
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1">
              <div
                className="p-2 hover:bg-green-300 rounded-full cursor-pointer"
                onClick={() => setShowComments((prev) => !prev)}
              >
                <FaRegCommentAlt size={15} />
              </div>
              <p>{comments.length}</p>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`p-2 rounded-full cursor-pointer ${isLiked ? "bg-white" : "hover:bg-red-300"
                  }`}
                onClick={likeDislikeHandler}
              >
                {isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
              </div>
              <p>{blogs?.likes?.length}</p>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`p-2 rounded-full cursor-pointer ${isBookmark ? "bg-white" : "hover:bg-yellow-300"
                  }`}
                onClick={bookmarkHandler}
              >
                {isBookmark ? <IoBookmark size={18} /> : <CiBookmark size={18} />}
              </div>
            </div>
            {user?._id === blogs?.userid && (
              <div className="flex items-center gap-1">
                <div
                  className="p-2 hover:bg-red-500 rounded-full cursor-pointer"
                  onClick={deletePostHandler}
                >
                  <MdDelete size={18} />
                </div>
              </div>
            )}
          </div>
          {showComments && (
            <div className="mt-2">
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded "
                onClick={postCommentHandler}
              >
                Post Comment
              </button>
              <div className="mt-2">
                {comments.map((comment, index) => (
                  <div key={index} className="p-2 border-b">
                    <p className="font-bold">
                      {comment?.postedby?.name || "Anonymous"}
                    </p>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

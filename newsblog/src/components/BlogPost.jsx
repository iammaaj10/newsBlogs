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
import { useSocket } from '../context/SocketProvider';
import { useNotification } from '../context/NotificationContext';
import profile from "../assets/profile.png"; 

const BlogPost = ({ blogs, isDarkMode }) => {
  const [isBookmark, setBookmark] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(blogs?.comments || []);
  const [likesCount, setLikesCount] = useState(blogs?.likes?.length || 0);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const socketContext = useSocket();
  const { notifications } = useNotification();

  const socket = socketContext?.socket;

  // Initialize socket connection with user ID
  useEffect(() => {
    if (socket && typeof socket.emit === 'function' && user?._id) {
      console.log('Socket initialized:', socket);
      socket.emit('join', user._id);
    } else {
      console.log('Socket not available:', socket, 'User ID:', user?._id);
    }
  }, [socket, user?._id]);

  // Determine if the current user has liked the post
  useEffect(() => {
    setLiked(blogs?.likes?.includes(user?._id));
    setLikesCount(blogs?.likes?.length || 0);
  }, [blogs?.likes, user?._id]);

  // Determine if the current user has bookmarked the post
  useEffect(() => {
    setBookmark(user?.Bookmarks?.includes(blogs?._id));
  }, [user?.Bookmarks, blogs?._id]);

  // Like/Dislike Handler with real-time notification
  const likeDislikeHandler = async () => {
    try {
      const res = await axios.put(
        `${BLOG_API_END_POINT}/likes/${blogs?._id}`,
        { id: user?._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateUsersLikes(res.data.updatedlikes));
        const newLikedState = !isLiked;
        setLiked(newLikedState);
        
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
        
        toast.success(res.data.message);

        if (socket && typeof socket.emit === 'function') {
          socket.emit('likeUpdate', {
            blogId: blogs._id,
            userId: user._id,
            liked: newLikedState,
            likesCount: newLikedState ? likesCount + 1 : likesCount - 1,
            blogOwnerId: blogs.userid
          });
        } else {
          console.log('Socket not available for like update');
        }

        if (newLikedState && blogs?.userid !== user?._id) {
          try {
            await axios.post(
              `${USER_API_END_POINT}/handleLike`,
              {
                userId: user._id,
                blogId: blogs._id,
                toUserId: blogs.userid
              },
              { withCredentials: true }
            );
          } catch (notifError) {
            console.error("Error sending like notification:", notifError);
          }
        }
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

  // Post Comment Handler with real-time notification
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
        const newComment = res.data.blog.comments[res.data.blog.comments.length - 1];
        setComments(res.data.blog.comments);
        setCommentText("");
        toast.success("Comment added successfully!");

        if (socket && typeof socket.emit === 'function') {
          socket.emit('commentUpdate', {
            blogId: blogs._id,
            comment: newComment,
            blogOwnerId: blogs.userid
          });
        } else {
          console.log('Socket not available for comment update');
        }

        if (blogs?.userid !== user?._id) {
          try {
            await axios.post(
              `${USER_API_END_POINT}/handleComment`,
              {
                userId: user._id,
                blogId: blogs._id,
                toUserId: blogs.userid
              },
              { withCredentials: true }
            );
          } catch (notifError) {
            console.error("Error sending comment notification:", notifError);
          }
        }
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

    if (blogs?._id) {
      fetchBlog();
    }
  }, [blogs?._id]);

  // Listen for real-time updates (comments, likes) via socket
  useEffect(() => {
    if (socket && typeof socket.on === 'function') {
      const handleNewComment = (data) => {
        if (data.blogId === blogs?._id) {
          setComments(prevComments => {
            const commentExists = prevComments.some(
              comment => comment._id === data.comment._id
            );
            if (!commentExists) {
              return [...prevComments, data.comment];
            }
            return prevComments;
          });
        }
      };

      const handleLikeUpdate = (data) => {
        if (data.blogId === blogs?._id && data.userId !== user?._id) {
          setLikesCount(data.likesCount);
        }
      };

      socket.on('commentUpdate', handleNewComment);
      socket.on('likeUpdate', handleLikeUpdate);

      return () => {
        if (socket && typeof socket.off === 'function') {
          socket.off('commentUpdate', handleNewComment);
          socket.off('likeUpdate', handleLikeUpdate);
        }
      };
    } else {
      console.log('Socket not available for event listeners');
    }
  }, [socket, blogs?._id, user?._id, dispatch]);

  return (
    <div className={`p-6 mt-2 mb-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
      isDarkMode 
        ? 'bg-gray-800/80 border border-gray-700/50 hover:bg-gray-800/90' 
        : 'bg-white/90 border border-gray-200/50 hover:bg-white'
    }`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Avatar
            src={
              blogs?.userDetails[0]?._id === user?._id
                ? user?.profilePic || profile
                : blogs?.userDetails[0]?.profilePic || profile
            }
            size="48"
            round={true}
            className="ring-2 ring-orange-500/20"
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <h1 className={`font-bold text-lg truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {blogs?.userDetails[0]?.name}
            </h1>
            <p className={`text-sm flex-shrink-0 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              @{blogs?.userDetails[0]?._id === user?._id
                ? user?.username
                : blogs?.userDetails[0]?.username
              } · 1m
            </p>
          </div>

          {/* Content */}
          <p className={`mb-4 leading-relaxed ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {blogs?.description}
          </p>

          {/* Image */}
          {blogs?.image && (
            <div className="mb-4">
              <img
                src={blogs?.image}
                alt="Blog"
                className="w-full max-w-md h-64 object-cover rounded-xl shadow-md border transition-transform duration-200 hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700/80 text-gray-300 hover:text-blue-400' 
                    : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setShowComments((prev) => !prev)}
              >
                <FaRegCommentAlt size={16} />
                <span className="text-sm font-medium">{comments.length}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                  isLiked 
                    ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500')
                    : (isDarkMode ? 'hover:bg-gray-700/80 text-gray-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600')
                }`}
                onClick={likeDislikeHandler}
              >
                {isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isBookmark
                    ? (isDarkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50')
                    : (isDarkMode ? 'hover:bg-gray-700/80 text-gray-300 hover:text-blue-400' : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600')
                }`}
                onClick={bookmarkHandler}
              >
                {isBookmark ? <IoBookmark size={18} /> : <CiBookmark size={18} />}
              </button>
            </div>

            {user?._id === blogs?.userid && (
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400' 
                      : 'hover:bg-red-50 text-gray-600 hover:text-red-500'
                  }`}
                  onClick={deletePostHandler}
                >
                  <MdDelete size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className={`mt-6 p-4 rounded-xl transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900/50 border border-gray-700/30' : 'bg-gray-50/80 border border-gray-200/50'
            }`}>
              <div className="mb-4">
                <textarea
                  className={`w-full p-4 border rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 ${
                    isDarkMode 
                      ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50' 
                      : 'bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-orange-500/50'
                  }`}
                  placeholder="Add a thoughtful comment..."
                  value={commentText}
                  rows="3"
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  className={`mt-3 px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
                  }`}
                  onClick={postCommentHandler}
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div key={comment._id || index} className={`p-4 rounded-xl transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-800/60 border border-gray-700/30 hover:bg-gray-800/80' 
                      : 'bg-white/80 border border-gray-200/50 hover:bg-white'
                  }`}>
                    <p className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {comment?.postedby?.name || "Anonymous"}
                    </p>
                    <p className={`leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {comment.text}
                    </p>
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
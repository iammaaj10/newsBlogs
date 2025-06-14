// BlogPost.jsx - Optimized version
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import profile from "../assets/profile.png";

const BlogPost = React.memo(({ blogs, isDarkMode }) => {
  // State management
  const [isBookmark, setBookmark] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const { socket, isConnected, emit } = useSocket();

  // Memoized values
  const blogId = useMemo(() => blogs?._id, [blogs?._id]);
  const userId = useMemo(() => user?._id, [user?._id]);
  const blogOwnerId = useMemo(() => blogs?.userid, [blogs?.userid]);
  const isOwnPost = useMemo(() => userId === blogOwnerId, [userId, blogOwnerId]);

  // Initialize state from props
  useEffect(() => {
    if (blogs) {
      setLiked(blogs.likes?.includes(userId) || false);
      setLikesCount(blogs.likes?.length || 0);
      setComments(blogs.comments || []);
    }
  }, [blogs, userId]);

  useEffect(() => {
    setBookmark(user?.Bookmarks?.includes(blogId) || false);
  }, [user?.Bookmarks, blogId]);

  // Socket event handlers with useCallback
  const handleLikeUpdate = useCallback((data) => {
    if (data.blogId === blogId && data.userId !== userId) {
      console.log('📊 Updating likes from socket:', data);
      setLikesCount(data.likesCount);
      if (data.likedUsers && Array.isArray(data.likedUsers)) {
        setLiked(data.likedUsers.includes(userId));
      }
    }
  }, [blogId, userId]);

  const handleCommentUpdate = useCallback((data) => {
    if (data.blogId === blogId) {
      console.log('💬 Adding comment from socket:', data);
      setComments(prevComments => {
        const exists = prevComments.some(c => c._id === data.comment._id);
        return exists ? prevComments : [...prevComments, data.comment];
      });
    }
  }, [blogId]);

  // Set up socket listeners (only once)
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('🎧 Setting up socket listeners for blog:', blogId);
    
    const unsubscribeLike = socket.on ? socket.on('likeUpdate', handleLikeUpdate) : () => {};
    const unsubscribeComment = socket.on ? socket.on('commentUpdate', handleCommentUpdate) : () => {};

    return () => {
      console.log('🧹 Cleaning up socket listeners for blog:', blogId);
      if (typeof unsubscribeLike === 'function') unsubscribeLike();
      if (typeof unsubscribeComment === 'function') unsubscribeComment();
    };
  }, [socket, isConnected, handleLikeUpdate, handleCommentUpdate, blogId]);

  // Optimized like handler
  const likeDislikeHandler = useCallback(async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const wasLiked = isLiked;
      const newLikedState = !wasLiked;
      const newLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;
      
      // Optimistic update
      setLiked(newLikedState);
      setLikesCount(newLikesCount);

      const res = await axios.put(
        `${BLOG_API_END_POINT}/likes/${blogId}`,
        { id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateUsersLikes(res.data.updatedlikes));
        
        // Emit socket event
        if (emit) {
          const success = emit('likeUpdate', {
            blogId,
            userId,
            liked: newLikedState,
            likesCount: newLikesCount,
            likedUsers: res.data.updatedlikes,
            blogOwnerId
          });
          
          if (success) {
            console.log('📡 Like update emitted successfully');
          }
        }

        // Send notification for others' posts
        if (newLikedState && !isOwnPost) {
          try {
            await axios.post(`${USER_API_END_POINT}/handleLike`, {
              userId,
              blogId,
              toUserId: blogOwnerId
            }, { withCredentials: true });
          } catch (notifyErr) {
            console.warn("🔔 Notification failed:", notifyErr.message);
          }
        }

        toast.success(res.data.message);
      } else {
        // Revert on failure
        setLiked(wasLiked);
        setLikesCount(likesCount);
        toast.error(res.data.message);
      }
    } catch (error) {
      // Revert on error
      setLiked(!isLiked);
      setLikesCount(likesCount);
      console.error("❌ Like error:", error);
      toast.error("Failed to update like status");
    } finally {
      setIsUpdating(false);
    }
  }, [isLiked, likesCount, blogId, userId, blogOwnerId, isOwnPost, emit, dispatch, isUpdating]);

  // Optimized bookmark handler
  const bookmarkHandler = useCallback(async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const wasBookmarked = isBookmark;
      setBookmark(!wasBookmarked);

      const res = await axios.put(
        `${USER_API_END_POINT}/bookmark/${blogId}`,
        { id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateUserBookmarks(res.data.updatedBookmarks));
        toast.success(res.data.message);
      } else {
        setBookmark(wasBookmarked);
        toast.error("Failed to update bookmark");
      }
    } catch (error) {
      setBookmark(!isBookmark);
      console.error("❌ Bookmark error:", error);
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  }, [isBookmark, blogId, userId, dispatch, isUpdating]);

  // Optimized comment handler
  const postCommentHandler = useCallback(async () => {
    if (!commentText.trim() || isUpdating) return;

    try {
      setIsUpdating(true);
      
      const res = await axios.put(
        `${BLOG_API_END_POINT}/addComment/${blogId}`,
        { text: commentText, id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        const newComment = res.data.blog.comments.slice(-1)[0];
        
        setComments(res.data.blog.comments);
        setCommentText("");
        
        // Emit socket event
        if (emit) {
          const success = emit('commentUpdate', {
            blogId,
            comment: newComment,
            blogOwnerId
          });
          
          if (success) {
            console.log('📡 Comment update emitted successfully');
          }
        }

        // Send notification for others' posts
        if (!isOwnPost) {
          try {
            await axios.post(`${USER_API_END_POINT}/handleComment`, {
              userId,
              blogId,
              toUserId: blogOwnerId
            }, { withCredentials: true });
          } catch (notifyErr) {
            console.warn("🔔 Notification failed:", notifyErr.message);
          }
        }

        toast.success("Comment added successfully!");
      } else {
        toast.error(res.data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("❌ Comment error:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsUpdating(false);
    }
  }, [commentText, blogId, userId, blogOwnerId, isOwnPost, emit, isUpdating]);

  // Delete handler
  const deletePostHandler = useCallback(async () => {
    if (!isOwnPost || isUpdating) return;
    
    try {
      setIsUpdating(true);
      const res = await axios.delete(`${BLOG_API_END_POINT}/delete/${blogId}`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        dispatch(toggleRefresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsUpdating(false);
    }
  }, [blogId, isOwnPost, dispatch, isUpdating]);

  // Loading state
  if (!blogs) {
    return (
      <div className={`p-6 mt-2 mb-4 rounded-xl shadow-lg animate-pulse ${
        isDarkMode ? 'bg-gray-800/80' : 'bg-white/90'
      }`}>
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
              blogs?.userDetails?.[0]?._id === userId
                ? user?.profilePic || profile
                : blogs?.userDetails?.[0]?.profilePic || profile
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
              {blogs?.userDetails?.[0]?.name}
            </h1>
            <p className={`text-sm flex-shrink-0 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              @{blogs?.userDetails?.[0]?._id === userId
                ? user?.username
                : blogs?.userDetails?.[0]?.username
              }
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
                src={blogs.image}
                alt="Blog"
                className="w-full max-w-md h-64 object-cover rounded-xl shadow-md border transition-transform duration-200 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between py-3">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-700/80 text-gray-300 hover:text-blue-400' 
                  : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setShowComments(prev => !prev)}
              disabled={isUpdating}
            >
              <FaRegCommentAlt size={16} />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>

            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500')
                  : (isDarkMode ? 'hover:bg-gray-700/80 text-gray-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600')
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={likeDislikeHandler}
              disabled={isUpdating}
            >
              {isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                isBookmark
                  ? (isDarkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50')
                  : (isDarkMode ? 'hover:bg-gray-700/80 text-gray-300 hover:text-blue-400' : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600')
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={bookmarkHandler}
              disabled={isUpdating}
            >
              {isBookmark ? <IoBookmark size={18} /> : <CiBookmark size={18} />}
            </button>

            {isOwnPost && (
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400' 
                    : 'hover:bg-red-50 text-gray-600 hover:text-red-500'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={deletePostHandler}
                disabled={isUpdating}
              >
                <MdDelete size={18} />
              </button>
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
                  disabled={isUpdating}
                />
                <button
                  className={`mt-3 px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
                  } ${isUpdating || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={postCommentHandler}
                  disabled={isUpdating || !commentText.trim()}
                >
                  {isUpdating ? 'Posting...' : 'Post Comment'}
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
});

BlogPost.displayName = 'BlogPost';

export default BlogPost;
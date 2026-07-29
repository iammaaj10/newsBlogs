// BlogPost.jsx - Editorial Light Theme Version
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Avatar from 'react-avatar';
import { HiChatBubbleLeft, HiHeart, HiOutlineHeart, HiBookmark, HiOutlineBookmark, HiTrash } from "react-icons/hi2";
import axios from 'axios';
import { BLOG_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleRefresh, updatePostLikes, updatePostComments } from '../redux/blogsSlics';
import { updateUserBookmarks, updateUsersLikes } from '../redux/userSlice';
import { useSocket } from '../context/SocketProvider';
import profile from "../assets/profile.png";

const BlogPost = React.memo(({ blogs }) => {
  const [isBookmark, setBookmark] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { socket, isConnected, emit } = useSocket();

  const blogId = useMemo(() => blogs?._id, [blogs?._id]);
  const userId = useMemo(() => user?._id, [user?._id]);
  const blogOwnerId = useMemo(() => blogs?.userid, [blogs?.userid]);
  const isOwnPost = useMemo(() => userId === blogOwnerId, [userId, blogOwnerId]);

  useEffect(() => {
    if (blogs) {
      const userHasLiked = blogs.likes?.some(id => id?.toString() === userId?.toString());
      setLiked(Boolean(userHasLiked));
      setLikesCount(blogs.likes?.length || 0);
      setComments(blogs.comments || []);
    }
  }, [blogs, userId]);

  useEffect(() => {
    const userHasBookmarked = user?.Bookmarks?.some(id => id?.toString() === blogId?.toString());
    setBookmark(Boolean(userHasBookmarked));
  }, [user?.Bookmarks, blogId]);

  const handleLikeUpdate = useCallback((data) => {
    if (data.blogId === blogId && data.userId !== userId) {
      setLikesCount(data.likesCount);
      if (data.likedUsers && Array.isArray(data.likedUsers)) {
        const userHasLiked = data.likedUsers.some(id => id?.toString() === userId?.toString());
        setLiked(Boolean(userHasLiked));
        dispatch(updatePostLikes({ blogId, likes: data.likedUsers }));
      }
    }
  }, [blogId, userId, dispatch]);

  const handleCommentUpdate = useCallback((data) => {
    if (data.blogId === blogId) {
      setComments((prevComments) => {
        const exists = prevComments.some((c) => c._id === data.comment._id);
        const newCommentsList = exists ? prevComments : [...prevComments, data.comment];
        dispatch(updatePostComments({ blogId, comments: newCommentsList }));
        return newCommentsList;
      });
    }
  }, [blogId, dispatch]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    const unsubscribeLike = socket.on ? socket.on('likeUpdate', handleLikeUpdate) : () => {};
    const unsubscribeComment = socket.on ? socket.on('commentUpdate', handleCommentUpdate) : () => {};

    return () => {
      if (typeof unsubscribeLike === 'function') unsubscribeLike();
      if (typeof unsubscribeComment === 'function') unsubscribeComment();
    };
  }, [socket, isConnected, handleLikeUpdate, handleCommentUpdate, blogId]);

  const likeDislikeHandler = useCallback(async () => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const wasLiked = isLiked;
      const newLikedState = !wasLiked;
      const newLikesCount = wasLiked ? Math.max(0, likesCount - 1) : likesCount + 1;

      setLiked(newLikedState);
      setLikesCount(newLikesCount);

      const res = await axios.put(
        `${BLOG_API_END_POINT}/likes/${blogId}`,
        { id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateUsersLikes(res.data.updatedlikes));
        dispatch(updatePostLikes({ blogId, likes: res.data.updatedlikes }));
        if (emit) {
          emit('likeUpdate', {
            blogId,
            userId,
            liked: newLikedState,
            likesCount: newLikesCount,
            likedUsers: res.data.updatedlikes,
            blogOwnerId,
          });
        }
        if (newLikedState && !isOwnPost) {
          try {
            await axios.post(
              `${USER_API_END_POINT}/handleLike`,
              { userId, blogId, toUserId: blogOwnerId },
              { withCredentials: true }
            );
          } catch (err) {}
        }
      } else {
        setLiked(wasLiked);
        setLikesCount(likesCount);
      }
    } catch (error) {
      setLiked(!isLiked);
      setLikesCount(likesCount);
      console.error("Like error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [isLiked, likesCount, blogId, userId, blogOwnerId, isOwnPost, emit, dispatch, isUpdating]);

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
      }
    } catch (error) {
      setBookmark(!isBookmark);
      console.error("Bookmark error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [isBookmark, blogId, userId, dispatch, isUpdating]);

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
        const updatedComments = res.data.blog.comments || [];
        const newComment = updatedComments.slice(-1)[0];
        setComments(updatedComments);
        dispatch(updatePostComments({ blogId, comments: updatedComments }));
        setCommentText("");
        if (emit) {
          emit('commentUpdate', { blogId, comment: newComment, blogOwnerId });
        }
        if (!isOwnPost) {
          try {
            await axios.post(
              `${USER_API_END_POINT}/handleComment`,
              { userId, blogId, toUserId: blogOwnerId },
              { withCredentials: true }
            );
          } catch (err) {}
        }
        toast.success("Comment added");
      }
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [commentText, blogId, userId, blogOwnerId, isOwnPost, emit, dispatch, isUpdating]);

  const deletePostHandler = useCallback(async () => {
    if (!isOwnPost || isUpdating) return;
    try {
      setIsUpdating(true);
      const res = await axios.delete(`${BLOG_API_END_POINT}/delete/${blogId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(toggleRefresh());
        toast.success("Post deleted");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [blogId, isOwnPost, dispatch, isUpdating]);

  const timeAgo = useMemo(() => {
    if (!blogs?.createdAt) return '';
    const date = new Date(blogs.createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  }, [blogs?.createdAt]);

  const authorName = blogs?.userDetails?.[0]?.name || (isOwnPost ? user?.name : 'Anonymous');
  const authorUsername = blogs?.userDetails?.[0]?.username || (isOwnPost ? user?.username : 'user');
  const authorPic = (isOwnPost ? user?.profilePic : blogs?.userDetails?.[0]?.profilePic) || profile;

  if (!blogs) return null;

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow font-sans">
      <div className="flex gap-3 sm:gap-4 items-start">
        <Avatar src={authorPic} size="42" round className="border border-slate-200 flex-shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          {/* Article Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-extrabold text-sm text-slate-900 truncate tracking-tight">{authorName}</h3>
              <span className="text-xs text-slate-500 truncate">@{authorUsername}</span>
              {timeAgo && (
                <>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{timeAgo}</span>
                </>
              )}
            </div>

            {isOwnPost && (
              <button
                onClick={deletePostHandler}
                disabled={isUpdating}
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete"
              >
                <HiTrash size={16} />
              </button>
            )}
          </div>

          {/* Article Body */}
          {blogs?.description && (
            <p className="text-sm text-slate-800 leading-relaxed mb-3.5 whitespace-pre-line font-normal">
              {blogs.description}
            </p>
          )}

          {/* Attachment Image */}
          {blogs?.image && (
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={blogs.image}
                alt="Article attachment"
                className="w-full max-h-96 object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Clean Action Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                showComments ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HiChatBubbleLeft size={16} />
              <span>{comments.length}</span>
            </button>

            <button
              onClick={likeDislikeHandler}
              disabled={isUpdating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isLiked
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              {isLiked ? <HiHeart size={16} className="text-rose-600" /> : <HiOutlineHeart size={16} />}
              <span>{likesCount}</span>
            </button>

            <button
              onClick={bookmarkHandler}
              disabled={isUpdating}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                isBookmark
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {isBookmark ? <HiBookmark size={16} className="text-indigo-600" /> : <HiOutlineBookmark size={16} />}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-xs rounded-lg outline-none bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && postCommentHandler()}
                  disabled={isUpdating}
                />
                <button
                  onClick={postCommentHandler}
                  disabled={isUpdating || !commentText.trim()}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Reply
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {comments.length > 0 ? (
                  comments.map((comment, index) => {
                    const commenterObj = typeof comment?.postedby === 'object' ? comment?.postedby : null;
                    const commenterName = commenterObj?.name || (comment?.postedby === user?._id ? user?.name : 'User');
                    const commenterUsername = commenterObj?.username || (comment?.postedby === user?._id ? user?.username : '');
                    const commenterPic = commenterObj?.profilePic || profile;

                    return (
                      <div
                        key={comment._id || index}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs"
                      >
                        <Avatar src={commenterPic} size="28" round className="border border-slate-200 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-slate-900">{commenterName}</span>
                            {commenterUsername && (
                              <span className="text-[11px] text-slate-400 font-medium">@{commenterUsername}</span>
                            )}
                          </div>
                          <p className="text-slate-700 leading-relaxed font-normal">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-center text-slate-400 py-1">No comments yet</p>
                )}
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
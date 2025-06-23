import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { USER_API_END_POINT } from '../utils/constant';
import Avatar from 'react-avatar';
import profile from "../assets/profile.png";

const BookmarksPage = () => {
  const { user } = useSelector((store) => store.user);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks/${user._id}`);
        console.log("Fetched Bookmarks:", res.data.bookmarks);
        setBookmarks(res.data.bookmarks || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchBookmarks();
    }
  }, [user]);

  if (loading) {
    return <p className="p-4 text-lg">Loading your bookmarks...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((blog) => (
            <div key={blog?._id || Math.random()} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
              {/* Author Information */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={blog?.userDetails?.[0]?.profilePic || profile}
                  size="40"
                  round={true}
                  className="ring-2 ring-orange-500/20"
                />
                <div className="flex flex-col">
                  <h4 className="font-semibold text-gray-900">
                    {blog?.userDetails?.[0]?.name || "Unknown Author"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    @{blog?.userDetails?.[0]?.username || "unknown"}
                  </p>
                </div>
              </div>

              {/* Render image only if it exists */}
              {blog?.image && (
                <img
                  src={blog?.image}
                  alt={blog?.title || "Blog image"}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              
              {/* Render title only if it exists */}
              {blog?.title && (
                <h3 className="text-xl font-semibold mb-2">{blog?.title}</h3>
              )}
              
              {/* Blog content/description */}
              <p className="text-gray-600 mt-2 line-clamp-3">
                {blog?.content?.slice(0, 150) || blog?.description?.slice(0, 150) || "No content available."}
                {(blog?.content?.length > 150 || blog?.description?.length > 150) && "..."}
              </p>

              {/* Optional: Add bookmark date if available */}
              {blog?.bookmarkedAt && (
                <p className="text-xs text-gray-400 mt-3">
                  Bookmarked: {new Date(blog.bookmarkedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">You haven't bookmarked any blogs yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start exploring and bookmark your favorite posts!</p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
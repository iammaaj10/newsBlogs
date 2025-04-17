import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { USER_API_END_POINT } from '../utils/constant';

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
            <div key={blog?._id || Math.random()} className="border rounded-lg p-4 shadow-md">
              <img
                src={blog?.image || "https://via.placeholder.com/300x180?text=No+Image"}
                alt={blog?.title || "Blog image"}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-xl font-semibold">{blog?.title || "Untitled Blog"}</h3>
              <p className="text-gray-600 mt-2">
                {blog?.content?.slice(0, 100) || blog?.description?.slice(0, 100) || "No content available."}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't bookmarked any blogs yet.</p>
      )}
    </div>
  );
};

export default BookmarksPage;

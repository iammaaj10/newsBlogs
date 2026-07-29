import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { USER_API_END_POINT } from '../utils/constant';
import BlogPost from './BlogPost';
import { HiBookmark } from 'react-icons/hi2';

const BookmarksPage = () => {
  const { user } = useSelector((store) => store.user);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks/${user._id}`, {
          withCredentials: true,
        });
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
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm animate-pulse font-sans">
        <p className="text-xs font-bold text-slate-400">Loading saved reading list...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-sans">
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3">
        <HiBookmark size={20} className="text-slate-900" />
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Saved Reading List</h2>
          <p className="text-xs text-slate-500 font-medium">Your bookmarked posts ({bookmarks.length})</p>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((blog) => (
            <BlogPost key={blog?._id || Math.random()} blogs={blog} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <HiBookmark size={32} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No saved posts yet</h3>
          <p className="text-xs text-slate-400">
            Click the bookmark icon on any post to save it to your reading list.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
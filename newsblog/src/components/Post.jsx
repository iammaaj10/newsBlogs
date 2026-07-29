import React from 'react';
import CreatePost from './CreatePost';
import BlogPost from './BlogPost';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';

const Post = () => {
  const { blogs } = useSelector((state) => state.blogs);
  const context = useOutletContext();
  const isDarkMode = context?.isDarkMode ?? true;

  return (
    <div className="w-full space-y-4">
      <CreatePost isDarkMode={isDarkMode} />
      {blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogPost key={blog?._id || Math.random()} blogs={blog} isDarkMode={isDarkMode} />
        ))
      ) : (
        <div
          className={`p-8 text-center rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
              : 'bg-white/80 border-slate-200 text-slate-600 shadow-sm'
          }`}
        >
          <HiOutlineSparkles size={40} className="mx-auto mb-3 text-indigo-500 opacity-80" />
          <h3 className="text-lg font-bold">No posts to display</h3>
          <p className="text-sm mt-1 opacity-80">
            Share your thoughts using the creator above or follow people to see their updates!
          </p>
        </div>
      )}
    </div>
  );
};

export default Post;
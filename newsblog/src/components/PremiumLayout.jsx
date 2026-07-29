import React, { useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import PremiumNav from './PremiumNav';
import RightBar from './RigthBar';
import useOtherUsers from '../hooks/useOtherUsers';
import { useSelector } from 'react-redux';
import useGetMyBlogs from '../hooks/useGetMyBlogs';
import { HiHome, HiOutlineHome, HiBell, HiOutlineBell, HiBookmark, HiOutlineBookmark, HiUser, HiOutlineUser } from 'react-icons/hi2';
import Avatar from 'react-avatar';
import profile1 from '../assets/profile.png';

const PremiumLayout = () => {
  const { user, otherUsers } = useSelector((store) => store.user);
  useOtherUsers(user?._id);
  useGetMyBlogs(user?._id);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 md:hidden flex items-center justify-between px-4 py-3 bg-white/95 border-b border-slate-200/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={user?.profilePic || profile1}
            size="36"
            round
            className="cursor-pointer border border-slate-200"
            onClick={() => navigate(`/premium/profile/${user?._id}`)}
          />
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit">
            News<span className="text-indigo-600">Blogs</span>
          </h1>
        </div>
      </header>

      {/* Desktop Main Layout Container */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 lg:gap-8 pt-4 sm:pt-6 pb-20 md:pb-10">
        {/* Left Navigation Sidebar */}
        <aside className="hidden md:block w-60 lg:w-72 flex-shrink-0 sticky top-6 h-[calc(100vh-3rem)]">
          <PremiumNav />
        </aside>

        {/* Center Main Feed */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto w-full">
          <Outlet context={{ isDarkMode: false }} />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 lg:w-96 flex-shrink-0 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
          <RightBar otherUsers={otherUsers} />
        </aside>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around items-center py-2 px-3 bg-white border-t border-slate-200/90 shadow-lg">
        <NavLink
          to="/premium"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold py-1.5 px-4 rounded-xl transition-all ${
              isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <HiHome size={22} className="text-slate-900" /> : <HiOutlineHome size={22} />}
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/premium/notifications"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold py-1.5 px-4 rounded-xl transition-all ${
              isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <HiBell size={22} className="text-slate-900" /> : <HiOutlineBell size={22} />}
              <span>Alerts</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/premium/bookmarks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold py-1.5 px-4 rounded-xl transition-all ${
              isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <HiBookmark size={22} className="text-slate-900" /> : <HiOutlineBookmark size={22} />}
              <span>Saved</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={`profile/${user?._id}`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold py-1.5 px-4 rounded-xl transition-all ${
              isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <HiUser size={22} className="text-slate-900" /> : <HiOutlineUser size={22} />}
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default PremiumLayout;
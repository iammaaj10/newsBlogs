import React from "react";
import { HiHome, HiOutlineHome, HiBell, HiOutlineBell, HiBookmark, HiOutlineBookmark, HiUser, HiOutlineUser, HiArrowRightOnRectangle } from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { getOtherUsers, getprofile, getUsers } from "../redux/userSlice";
import Avatar from "react-avatar";
import profile1 from "../assets/profile.png";

const PremiumNav = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(getUsers(null));
      dispatch(getOtherUsers(null));
      dispatch(getprofile(null));
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    {
      to: "/premium",
      label: "Home Feed",
      iconActive: <HiHome size={22} className="text-slate-900" />,
      iconInactive: <HiOutlineHome size={22} className="text-slate-500" />,
      end: true,
    },
    {
      to: "/premium/notifications",
      label: "Notifications",
      iconActive: <HiBell size={22} className="text-slate-900" />,
      iconInactive: <HiOutlineBell size={22} className="text-slate-500" />,
    },
    {
      to: "/premium/bookmarks",
      label: "Saved Posts",
      iconActive: <HiBookmark size={22} className="text-slate-900" />,
      iconInactive: <HiOutlineBookmark size={22} className="text-slate-500" />,
    },
    {
      to: `profile/${user?._id}`,
      label: "My Profile",
      iconActive: <HiUser size={22} className="text-slate-900" />,
      iconInactive: <HiOutlineUser size={22} className="text-slate-500" />,
    },
  ];

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full font-sans">
      <div>
        {/* Editorial Brand Header */}
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="cursor-pointer" onClick={() => navigate("/premium")}>
            <h2 className="text-2xl font-black tracking-tight font-outfit text-slate-900">
              News<span className="text-indigo-600">Blogs</span>
            </h2>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-md bg-slate-900 text-white uppercase">
            PRO
          </span>
        </div>

        {/* User Card */}
        <div
          onClick={() => navigate(`profile/${user?._id}`)}
          className="flex items-center gap-3 p-3 mb-6 rounded-xl cursor-pointer bg-slate-50 border border-slate-200/70 hover:bg-slate-100/80 transition-colors"
        >
          <Avatar
            src={user?.profilePic || profile1}
            size="40"
            round
            className="border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-slate-900 truncate">{user?.name || "User"}</h4>
            <p className="text-[11px] text-slate-500 truncate">@{user?.username || "username"}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>
                    {isActive
                      ? React.cloneElement(item.iconActive, { className: "text-white" })
                      : item.iconInactive}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 transition-all"
        >
          <HiArrowRightOnRectangle size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default PremiumNav;
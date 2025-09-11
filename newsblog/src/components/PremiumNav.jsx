import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { getOtherUsers, getprofile, getUsers } from "../redux/userSlice";

const PremiumNav = ({ isDarkMode }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      console.log(res);
      navigate("/");
      dispatch(getUsers(null));
      dispatch(getOtherUsers(null));
      dispatch(getprofile(null));
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Dynamic classes based on theme
  const navItemClass = (isActive) => `
    flex items-center gap-2 p-2 my-3 hover:cursor-pointer rounded-md transition-colors duration-200
    ${isDarkMode 
      ? `hover:bg-gray-700 ${isActive ? 'text-blue-400 bg-gray-700' : 'text-gray-200'}` 
      : `hover:bg-gray-300 ${isActive ? 'text-gray-500 bg-gray-200' : 'text-black'}`
    }
  `;

  const regularNavItemClass = `
    flex items-center gap-2 p-2 my-3 hover:cursor-pointer rounded-md transition-colors duration-200
    ${isDarkMode 
      ? 'hover:bg-gray-700 text-gray-200' 
      : 'hover:bg-gray-300 text-black'
    }
  `;

  return (
    <div className="w-[20%]">
      <div>
        <h2 className={`text-2xl font-bold transition-colors duration-200 ${
          isDarkMode ? 'text-blue-400' : 'text-blue-400'
        }`}>
          News<span className="text-3xl text-red-500 font-bold">B</span>logs
        </h2>
      </div>
      <div>
        <NavLink
          to="/premium"
          end
          className={({ isActive }) => navItemClass(isActive)}
        >
          <AiFillHome />
          <p className="text-lg font-semibold">Home</p>
        </NavLink>
        
        
        <NavLink
          to="/premium/notifications"
          className={({ isActive }) => navItemClass(isActive)}
        >
          <IoIosNotificationsOutline size={20} />
          <p className="text-lg font-semibold">Notification</p>
        </NavLink>
        
        <NavLink
          to={`profile/${user?._id}`}
          className={({ isActive }) => navItemClass(isActive)}
        >
          <CgProfile />
          <p className="text-lg font-semibold">Profile</p>
        </NavLink>
        
        <NavLink
          to="/premium/bookmarks"
          className={({ isActive }) => navItemClass(isActive)}
        >
          <CiBookmark />
          <p className="text-lg font-semibold">Bookmarks</p>
        </NavLink>
        
        <div
          onClick={logoutHandler}
          className={regularNavItemClass}
        >
          <IoMdLogOut />
          <p className="text-lg font-semibold">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumNav;
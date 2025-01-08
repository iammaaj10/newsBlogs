import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { getOtherUsers, getprofile, getUsers } from '../redux/userSlice';

const PremiumNav = () => {
  const { user } = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      console.log(res);
      navigate('/');
      dispatch(getUsers(null));
      dispatch(getOtherUsers(null));
      dispatch(getprofile(null));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='w-[20%]'>
      <div>
        <h2 className="text-2xl text-blue-400 font-bold">
          News<span className="text-3xl text-red-500 font-bold">B</span>logs
        </h2>
      </div>
      <div>
        <NavLink
          to="/premium"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md ${isActive ? "text-gray-500" : "text-black"}`
          }
        >
          <AiFillHome />
          <p className='text-lg font-semibold'>Home</p>
        </NavLink>
        <div className='flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md'>
          <FaHashtag />
          <p className='text-lg font-semibold'>Explore</p>
        </div>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md ${isActive ? "text-gray-500" : "text-black"}`
          }
        >
          <IoIosNotificationsOutline size={20} />
          <p className='text-lg font-semibold'>Notification</p>
        </NavLink>
        <NavLink
          to={`profile/${user?._id}`}
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md ${isActive ? "text-gray-500" : "text-black"}`
          }
        >
          <CgProfile />
          <p className='text-lg font-semibold'>Profile</p>
        </NavLink>
        <div className='flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md'>
          <CiBookmark />
          <p className='text-lg font-semibold'>Bookmarks</p>
        </div>
        <div
          onClick={logoutHandler}
          className='flex items-center gap-2 p-2 my-3 hover:bg-gray-300 hover:cursor-pointer rounded-md'
        >
          <IoMdLogOut />
          <p className='text-lg font-semibold'>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumNav;

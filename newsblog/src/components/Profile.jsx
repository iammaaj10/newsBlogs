import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import Profile1 from "../assets/profile.jpg";
import useGetProfile from '../hooks/useGetProfile';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { followingUpdate } from '../redux/userSlice';
import { toggleRefresh } from '../redux/blogsSlics';


const Profile = () => {
    const { user, profile } = useSelector(store => store.user)
    const { id } = useParams()
    const dispatch = useDispatch()
    useGetProfile(id)

    const followAndUnfollowHandler = async () => {
       if(user.following.includes(id))
       {
        
        try {
            axios.defaults.withCredentials=true
            const res = await axios.post(
              `${USER_API_END_POINT}/unfollow/${id}`,
              { id: user?._id }
            );
            dispatch(followingUpdate(id))
            dispatch(toggleRefresh())
            console.log(res);
          } catch (error) {
            console.error("Error:", error.response?.data || error.message);
          }
          
       }
       else{
        try {
            axios.defaults.withCredentials=true
            const res = await axios.post(
              `${USER_API_END_POINT}/follower/${id}`,
              { id: user?._id }
            );
            dispatch(followingUpdate(id))
            dispatch(toggleRefresh())
            console.log(res);
          } catch (error) {
            console.error("Error:", error.response?.data || error.message);
          }
       }
    };


    return (
        <div className='w-[55%]'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/premium" className='hover:bg-gray-200 hover:cursor-pointer p-2 '>
                        <IoArrowBackCircleOutline size="24px" />

                    </Link>
                    <div className='ml-2'>

                        <h1 className='text-lg font-bold font-poppins'>{profile?.name}</h1>
                        <p className='text-sm text-gray-500 font-poppins'>10 Blogs</p>
                    </div>

                </div>
                <img src="https://imgs.search.brave.com/v8Lgjc62rJivvFtkzX91-czZPti2om6TblO7kJhZTEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/MDIzMDIzOC9waG90/by9tYWxlLWhhY2tl/cnMtZG9pbmctY29k/aW5nLW92ZXItbGFw/dG9wLWF0LXN0YXJ0/dXAtY29tcGFueS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/R0d5Umhnb2RuMDB1/MW8xalVHckFIMEcz/S1RKS3I1aUgxT3Uz/YThhYVBBaz0"
                    alt="banner" className='rounded-md w-full h-60' />
                <div className='absolute top-[260px] border-4 border-white rounded-full m-2 '>
                    <Avatar src={Profile1} size="90" round={true} />
                </div>

                <div className='text-right p-2'>
                    {
                        profile?._id === user?._id ? (
                            <button className="px-2 py-2 hover:bg-gray-500 hover:scale-105 transition border border-gray-200 rounded-full font-semibold font-poppins bg-slate-200">
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={followAndUnfollowHandler}
                                className="px-2 py-2 bg-black text-white rounded-full font-semibold font-poppins"
                            >
                                {user?.following?.includes(id) ? "Following" : "Follow"}
                            </button>
                        )
                    }

                </div>
                <div className='m-3'>
                    <h1 className='text-lg font-bold font-poppins'>{profile?.name}</h1>
                    <p className='text-sm'>{`@${profile?.username}`}</p>
                </div>
                <div className='m-3'>
                    <p className='text-sm font-poppins'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate asperiores, aspernatur nesciunt quam ab consequatur voluptatibus illo ea eum fuga accusantium. Ratione unde dicta vero. Quae asperiores placeat esse facilis sed beatae ipsum odio tempora. Error hic perspiciatis iste quia.</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
import React, { useState, useEffect } from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { followingUpdate } from '../redux/userSlice';
import { toggleRefresh } from '../redux/blogsSlics';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    const dispatch = useDispatch();

    // Edit profile state
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        username: profile?.username || '',
        about: profile?.about || '',
        profilePic: profile?.profilePic || ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile({
            ...updatedProfile,
            [name]: value
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setUpdatedProfile({
            ...updatedProfile,
            profilePic: e.target.files[0]
        });
    };

    // Handle save profile changes
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('username', updatedProfile.username);
            formData.append('about', updatedProfile.about);
            if (updatedProfile.profilePic) {
                formData.append('profilePic', updatedProfile.profilePic);
            }

            axios.defaults.withCredentials = true;
            const res = await axios.put(
                `${USER_API_END_POINT}/updateprofile/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // Update the Redux store with the new profile data
            dispatch(followingUpdate(id));
            dispatch(toggleRefresh());
            setIsEditing(false);  // Exit edit mode after successful update
            console.log(res);
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };

    // Handle follow/unfollow functionality
    const followAndUnfollowHandler = async () => {
        if (user.following.includes(id)) {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(
                    `${USER_API_END_POINT}/unfollow/${id}`,
                    { id: user?._id }
                );
                dispatch(followingUpdate(id));
                dispatch(toggleRefresh());
                console.log(res);
            } catch (error) {
                console.error("Error:", error.response?.data || error.message);
            }
        } else {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(
                    `${USER_API_END_POINT}/follower/${id}`,
                    { id: user?._id }
                );
                dispatch(followingUpdate(id));
                dispatch(toggleRefresh());
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
                    <Link to="/premium" className='hover:bg-gray-200 hover:cursor-pointer p-2'>
                        <IoArrowBackCircleOutline size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='text-lg font-bold font-poppins'>{profile?.name}</h1>
                        <p className='text-sm text-gray-500 font-poppins'>10 Blogs</p>
                    </div>
                </div>
                <img src="https://imgs.search.brave.com/v8Lgjc62rJivvFtkzX91-czZPti2om6TblO7kJhZTEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/MDIzMDIzOC9waG90/by9tYWxlLWhhY2tl/cnMtZG9pbmctY29k/aW5nLW92ZXItbGFw/dG9wLWF0LXN0YXJ0/dXAtY29tcGFueS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/R0d5Umhnb2RuMDB1/MW8xalVHckFIMEcz/S1RKS3I1aUgxT3Uz/YThhYVBBaz0"
                    alt="banner" className='rounded-md w-full h-60' />
                <div className='absolute top-[260px] border-4 border-white rounded-full m-2'>
                    {/* Conditionally render the avatar */}
                    <Avatar 
                        src={updatedProfile.profilePic ? 
                            URL.createObjectURL(updatedProfile.profilePic) : 
                            profile?.profilePic || profile} 
                        size="90" 
                        round={true} 
                    />
                </div>

                <div className='text-right p-2'>
                    {profile?._id === user?._id ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-2 py-2 hover:bg-gray-500 hover:scale-105 transition border border-gray-200 rounded-full font-semibold font-poppins bg-slate-200"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            className="px-2 py-2 bg-black text-white rounded-full font-semibold font-poppins"
                        >
                            {user?.following?.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                {/* Profile details */}
                <div className='m-3'>
                    <h1 className='text-lg font-bold font-poppins'>{profile?.name}</h1>
                    <p className='text-sm'>{`@${profile?.username}`}</p>
                </div>
                <div className='m-3'>
                    <p className='text-sm font-poppins'>{profile?.about}</p>
                </div>

                {/* Edit Profile Form */}
                {isEditing && (
                    <div className='m-3'>
                        <h2 className='text-xl font-bold'>Edit Profile</h2>
                        <input
                            type="text"
                            name="username"
                            value={updatedProfile.username}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="Update Username"
                        />
                        <textarea
                            name="about"
                            value={updatedProfile.about}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="About Me"
                        />
                        <input
                            type="file"
                            name="profilePic"
                            onChange={handleFileChange}
                            className="w-full p-2 mt-2"
                        />
                        <button
                            onClick={handleSaveChanges}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

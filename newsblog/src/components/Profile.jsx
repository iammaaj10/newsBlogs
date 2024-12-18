import React, { useState, useEffect } from 'react';
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

    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        username: profile?.username || '',
        about: profile?.about || '',
        profilePic: profile?.profilePic || ''
    });

    const [profilePicUrl, setProfilePicUrl] = useState(updatedProfile.profilePic);

   
    useEffect(() => {
        if (updatedProfile.profilePic && updatedProfile.profilePic instanceof File) {
            const url = URL.createObjectURL(updatedProfile.profilePic);
            setProfilePicUrl(url);

            
            return () => URL.revokeObjectURL(url);
        } else {
            setProfilePicUrl(updatedProfile.profilePic);
        }
    }, [updatedProfile.profilePic]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile({
            ...updatedProfile,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            axios.defaults.withCredentials = true;
            const formData = new FormData();
            formData.append('username', updatedProfile.username);
            formData.append('about', updatedProfile.about);
            formData.append('profilePic', updatedProfile.profilePic);

            const res = await axios.put(`${USER_API_END_POINT}/updateprofile/${user._id}`, formData);
            dispatch(toggleRefresh());
            setIsEditing(false);
            console.log(res.data);
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };

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
        <div className="w-[55%]">
            <div>
                <div className="flex items-center py-2">
                    <Link to="/premium" className="hover:bg-gray-200 hover:cursor-pointer p-2">
                        <IoArrowBackCircleOutline size="24px" />
                    </Link>
                    <div className="ml-2">
                        <h1 className="text-lg font-bold">{profile?.name}</h1>
                        <p className="text-sm text-gray-500">10 Blogs</p>
                    </div>
                </div>
                {/* <img
                    src="https://imgs.search.brave.com/v8Lgjc62rJivvFtkzX91-czZPti2om6TblO7kJhZTEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/MDIzMDIzOC9waG90/by9tYWxlLWhhY2tl/cnMtZG9pbmctY29k/aW5nLW92ZXItbGFw/dG9wLWF0LXN0YXJ0/dXAtY29tcGFueS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/R0d5Umhnb2RuMDB1/MW8xalVHckFIMEcz/S1RKS3I1aUgxT3Uz/YThhYVBBaz0"
                    alt="banner"
                    className="rounded-md w-full h-60"
                /> */}
                <div className="absolute top-[100px] right-[500px] border-4 border-white rounded-full m-2">
                    <Avatar src={profilePicUrl || Profile1} size="300" round={true} />
                </div>

                <div className="text-right p-2">
                    {profile?._id === user?._id ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-2 py-2 hover:bg-gray-500 hover:scale-105 transition border border-gray-200 rounded-full font-semibold bg-slate-200"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            className="px-2 py-2 bg-black text-white rounded-full font-semibold"
                        >
                            {user?.following?.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                {isEditing && (
                    <div className="m-3">
                        <h2 className="text-lg font-bold">Edit Profile</h2>
                        <input
                            type="text"
                            name="username"
                            value={updatedProfile.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                        />
                        <textarea
                            name="about"
                            value={updatedProfile.about}
                            onChange={handleInputChange}
                            placeholder="About you"
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                        />
                        <input
                            type="file"
                            name="profilePic"
                            onChange={(e) => setUpdatedProfile({ ...updatedProfile, profilePic: e.target.files[0] })}
                            className="w-full mt-2"
                        />
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded mt-3"
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                <div className="m-3">
                    <h1 className="text-lg font-bold">{profile?.name}</h1>
                    <p className="text-md">{`@${profile?.username}`}</p>
                </div>
                <div className="m-3">
                    
                    <p className="text-md font-poppins">{`${profile?.about}`}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

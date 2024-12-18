import React, { useState, useEffect } from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { updateProfile } from '../redux/userSlice';
import useGetProfile from '../hooks/useGetProfile';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    const dispatch = useDispatch();
    useGetProfile(id);

    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        username: profile?.username || '',
        about: profile?.about || '',
        profilePic: profile?.profilePic || ''
    });

    const [profilePicUrl, setProfilePicUrl] = useState(updatedProfile.profilePic);

    // Sync profile data with Redux
    useEffect(() => {
        setUpdatedProfile({
            username: profile?.username || '',
            about: profile?.about || '',
            profilePic: profile?.profilePic || ''
        });
    }, [profile]);

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
            formData.append('profilePic', updatedProfile.profilePic);  // Assuming profilePic is a URL or a file

            const res = await axios.put(`${USER_API_END_POINT}/updateprofile/${user._id}`, formData);

            // Update Redux store with the updated profile
            dispatch(updateProfile({
                username: updatedProfile.username,
                about: updatedProfile.about,
                profilePic: res.data.user.profilePic || updatedProfile.profilePic,
            }));

            setIsEditing(false); // Exit editing mode
            console.log("Profile updated successfully:", res.data);
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };

    const followAndUnfollowHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const endpoint = user.following.includes(id)
                ? `${USER_API_END_POINT}/unfollow/${id}`
                : `${USER_API_END_POINT}/follower/${id}`;
            await axios.post(endpoint, { id: user?._id });
            dispatch(toggleRefresh());
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 rounded-xl shadow-md w-4/5 mx-auto mt-10">
            <div className="flex justify-between w-full mb-5">
                <Link to="/premium" className="text-gray-500 hover:text-gray-800">
                    <IoArrowBackCircleOutline size="30px" />
                </Link>
                {profile?._id === user?._id ? (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                ) : (
                    <button
                        onClick={followAndUnfollowHandler}
                        className={`px-4 py-2 rounded-lg ${
                            user?.following?.includes(id)
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                        {user?.following?.includes(id) ? "Unfollow" : "Follow"}
                    </button>
                )}
            </div>

            {/* Profile Picture */}
            <Avatar
                src={profilePicUrl || 'https://via.placeholder.com/150'}
                size="150"
                round={true}
                className="border-4 border-gray-300 shadow-md"
            />

            {/* Profile Details */}
            {!isEditing ? (
                <div className="text-center mt-5">
                    <h1 className="text-2xl font-bold">{profile?.username || "Username"}</h1>
                    <p className="text-gray-600 text-lg">{profile?.about || "About section not available."}</p>
                </div>
            ) : (
                <div className="mt-5 w-full max-w-md">
                    <input
                        type="text"
                        name="username"
                        value={updatedProfile.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                    />
                    <textarea
                        name="about"
                        value={updatedProfile.about}
                        onChange={handleInputChange}
                        placeholder="About you"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                    />
                    <input
                        type="file"
                        name="profilePic"
                        onChange={(e) =>
                            setUpdatedProfile({
                                ...updatedProfile,
                                profilePic: e.target.files[0],
                            })
                        }
                        className="w-full mb-3"
                    />
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;

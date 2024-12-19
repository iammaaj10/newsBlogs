import React, { useState, useEffect } from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { updateProfile, getprofile, followingUpdate } from '../redux/userSlice';
import { toggleRefresh } from '../redux/blogsSlics';

const Profile = () => {
    const { user, profile } = useSelector((store) => store.user);
    const { id } = useParams();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        username: '',
        about: '',
        profilePic: '',
    });

    const [profilePicUrl, setProfilePicUrl] = useState('');

    // Fetch profile data on component load or when ID changes
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true,
                });
                dispatch(getprofile(res.data.user)); // Update Redux store with fetched profile
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };

        if (id) fetchProfile();
    }, [id, dispatch]);

    // Sync local state with Redux profile
    useEffect(() => {
        if (profile) {
            setUpdatedProfile({
                username: profile.username || '',
                about: profile.about || '',
                profilePic: profile.profilePic || '',
            });
            setProfilePicUrl(profile.profilePic || '');
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile({
            ...updatedProfile,
            [name]: value,
        });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProfile({
                    ...updatedProfile,
                    profilePic: reader.result, // Base64 image
                });
                setProfilePicUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const res = await axios.put(
                `${USER_API_END_POINT}/updateprofile/${user._id}`,
                updatedProfile,
                { withCredentials: true }
            );

            dispatch(updateProfile(res.data.user)); // Update Redux store with updated profile
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };

    const followAndUnfollowHandler = async () => {
        try {
            const endpoint = user.following.includes(id)
                ? `${USER_API_END_POINT}/unfollow/${id}`
                : `${USER_API_END_POINT}/follower/${id}`;

            await axios.post(endpoint, { id: user?._id }, { withCredentials: true });

            dispatch(followingUpdate(id)); // Update Redux store
            dispatch(toggleRefresh()); // Trigger refresh for other components
        } catch (error) {
            console.error("Error in follow/unfollow:", error.response?.data || error.message);
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
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700"
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

            <Avatar
                src={profilePicUrl || 'https://via.placeholder.com/150'}
                size="150"
                round={true}
                className="border-4 border-gray-300 shadow-md"
            />

            {!isEditing ? (
                <div className="text-center mt-5">
                    <h1 className="text-2xl font-bold">{updatedProfile.username || "Username"}</h1>
                    <p className='font-poppins text-blue-500 font-bold text-lg mt-2'>About section</p>
                    <p className="text-gray-600 text-lg">{updatedProfile.about || "About section not available."}</p>
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
                        onChange={handleProfilePicChange}
                        className="w-full mb-3"
                    />
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-800 w-full"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;

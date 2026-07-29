import React, { useState, useEffect } from 'react';
import { HiArrowLeft, HiPencilSquare, HiUserPlus, HiUserMinus } from 'react-icons/hi2';
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { updateProfile, getprofile, followingUpdate } from '../redux/userSlice';
import { toggleRefresh } from '../redux/blogsSlics';
import { toast } from 'react-toastify';
import profile1 from "../assets/profile.png";

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true,
                });
                dispatch(getprofile(res.data.user));
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };

        if (id) fetchProfile();
    }, [id, dispatch]);

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
            if (file.size > 5 * 1024 * 1024) {
                return toast.error("Profile picture must be under 5MB.");
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProfile((prev) => ({
                    ...prev,
                    profilePic: reader.result,
                }));
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

            if (res.data.success || res.data.user) {
                dispatch(updateProfile(res.data.user));
                dispatch(toggleRefresh());
                toast.success("Profile updated successfully");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            toast.error("Failed to update profile.");
        }
    };

    const followAndUnfollowHandler = async () => {
        try {
            const isFollowing = user?.following?.includes(id);
            const endpoint = isFollowing
                ? `${USER_API_END_POINT}/unfollow/${id}`
                : `${USER_API_END_POINT}/follower/${id}`;

            const res = await axios.post(endpoint, { id: user?._id }, { withCredentials: true });

            dispatch(followingUpdate(id));
            dispatch(toggleRefresh());
            toast.success(res.data?.message || (isFollowing ? "Unfollowed" : "Following"));
        } catch (error) {
            console.error("Error in follow/unfollow:", error.response?.data || error.message);
        }
    };

    const isOwnProfile = profile?._id === user?._id;
    const isFollowing = user?.following?.includes(id);

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
            {/* Header Banner */}
            <div className="h-32 sm:h-40 w-full bg-slate-100 border-b border-slate-200/80 p-4 flex justify-between items-start">
                <Link to="/premium" className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:text-slate-900 transition-colors">
                    <HiArrowLeft size="18px" />
                </Link>

                {isOwnProfile ? (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                        <HiPencilSquare size={16} />
                        <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                    </button>
                ) : (
                    <button
                        onClick={followAndUnfollowHandler}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                            isFollowing
                                ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                    >
                        {isFollowing ? <HiUserMinus size={16} /> : <HiUserPlus size={16} />}
                        <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                    </button>
                )}
            </div>

            {/* Profile Avatar & Stats */}
            <div className="px-6 relative -mt-14 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
                <Avatar
                    src={profilePicUrl || profile1}
                    size="110"
                    round={true}
                    className="border-4 border-white shadow-md bg-slate-100"
                />

                <div className="flex gap-6 text-center py-1">
                    <div>
                        <span className="block text-base font-extrabold text-slate-900">
                            {profile?.followers?.length || 0}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Followers</span>
                    </div>
                    <div className="border-r border-slate-200 h-7 my-auto"></div>
                    <div>
                        <span className="block text-base font-extrabold text-slate-900">
                            {profile?.following?.length || 0}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Following</span>
                    </div>
                </div>
            </div>

            {/* Profile Details or Edit Form */}
            <div className="p-6 space-y-4">
                {!isEditing ? (
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile?.name || "User"}</h2>
                            <p className="text-xs font-bold text-slate-500">@{profile?.username || "username"}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">About</h4>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                {profile?.about || "No bio information provided yet."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-md mx-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Edit Profile Details</h3>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={updatedProfile.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-xs rounded-xl outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">About Bio</label>
                            <textarea
                                name="about"
                                value={updatedProfile.about}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 text-xs rounded-xl outline-none bg-slate-50 border border-slate-200 text-slate-900 resize-none focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
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

import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RightBar = ({ otherUsers }) => {
    const { profile, user } = useSelector((store) => store.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUser, setFilteredUser] = useState(null);

    const searchById = () => {
        if (searchTerm.trim()) {
            const foundUser = otherUsers.find(
                (u) => u.username.toLowerCase() === searchTerm.toLowerCase()
            );
            if (foundUser) {
                setFilteredUser(foundUser);
            } else {
                setFilteredUser(null);
                alert('User not found');
            }
        }
    };

    return (
        <div className="w-[20%]">
            {/* Search Bar */}
            <div className="flex items-center bg-gray-200 rounded-full outline-none px-2">
                <CiSearch size="20px" onClick={searchById} className="cursor-pointer" />
                <input
                    type="text"
                    placeholder="Search"
                    className="outline-none bg-transparent p-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Search Result */}
            {filteredUser && (
                <div className="p-4 bg-gray-200 rounded-xl outline-none w-full my-4">
                    <h1 className="text-lg font-bold font-poppins">Search Result</h1>
                    <div className="flex items-center justify-between my-3">
                        {/* User Info */}
                        <div className="flex items-center">
                            <Avatar
                                src={filteredUser.profilePic || 'https://via.placeholder.com/150'}
                                size="40"
                                round={true}
                            />
                            <div className="ml-2">
                                <h1 className="font-semibold">{filteredUser.name}</h1>
                                <p className="font-normal text-sm text-gray-600">
                                    @{filteredUser.username}
                                </p>
                            </div>
                        </div>

                        <Link to={`/premium/profile/${filteredUser._id}`}>
                            <button className="bg-black text-white font-semibold py-1 px-4 rounded-full">
                                Profile
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Follow Section */}
            <div className="p-4 bg-gray-200 rounded-xl outline-none w-full my-4">
                <h1 className="text-lg font-bold font-poppins">Follow to Explore More</h1>
                {otherUsers?.map((user) => (
                    <div key={user?._id} className="flex items-center justify-between my-3">
                        {/* User Info */}
                        <div className="flex items-center">
                            <Avatar
                                src={user?.profilePic || 'https://via.placeholder.com/150'}
                                size="40"
                                round={true}
                            />
                            <div className="ml-2">
                                <h1 className="font-semibold">{user?.name}</h1>
                                <p className="font-normal text-sm text-gray-600">@{user?.username}</p>
                            </div>
                        </div>

                        <Link to={`/premium/profile/${user?._id}`}>
                            <button className="bg-black text-white font-semibold py-1 px-4 rounded-full">
                                Profile
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RightBar;

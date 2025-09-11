import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profile1 from "../assets/profile.png"; 

const RightBar = ({ otherUsers, isDarkMode }) => {
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

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredUser(null);
    };

    // Styles
    const searchBarClass = `
        flex items-center rounded-full outline-none px-3 transition-all duration-300 shadow-sm
        ${isDarkMode 
            ? 'bg-gray-800/80 backdrop-blur-md text-white' 
            : 'bg-gray-200/70 backdrop-blur-md text-black'
        }
        focus-within:shadow-lg focus-within:scale-[1.02]
    `;

    const searchInputClass = `
        outline-none bg-transparent py-2 w-full text-sm
        ${isDarkMode 
            ? 'text-white placeholder-gray-400' 
            : 'text-black placeholder-gray-600'
        }
    `;

    const cardClass = `
        p-4 rounded-2xl outline-none w-full my-4 transition-all duration-300 shadow-md
        ${isDarkMode 
            ? 'bg-gray-800/80 backdrop-blur-lg text-white' 
            : 'bg-white/80 backdrop-blur-lg text-black'
        }
    `;

    const usernameClass = `
        font-normal text-xs transition-colors duration-200
        ${isDarkMode 
            ? 'text-gray-400' 
            : 'text-gray-600'
        }
    `;

    const buttonClass = `
        font-semibold py-1 px-4 rounded-full text-sm transition-all duration-200
        ${isDarkMode 
            ? 'bg-blue-600 text-white hover:bg-blue-500' 
            : 'bg-black text-white hover:bg-orange-500'
        }
    `;

    const searchIconClass = `
        cursor-pointer transition-all duration-200 rounded-full p-1
        ${isDarkMode 
            ? 'hover:bg-blue-600 hover:text-white' 
            : 'hover:bg-orange-500 hover:text-white'
        }
    `;

    const userRowClass = `
        flex items-center justify-between my-3 p-2 rounded-lg transition-all duration-200
        hover:shadow-md hover:scale-[1.01]
        ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}
    `;

    return (
        <div className="w-full sm:w-[35%] lg:w-[20%] mt-4 sm:mt-0">
            {/* Search Bar */}
            <div className={searchBarClass}>
                <CiSearch 
                    size="20px" 
                    onClick={searchById} 
                    className={searchIconClass}
                />
                <input
                    type="text"
                    placeholder="Search"
                    className={searchInputClass}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchById()}
                />
                {filteredUser && (
                    <IoClose 
                        size="20px"
                        onClick={clearSearch}
                        className={`cursor-pointer transition-all duration-200 rounded-full p-1 
                            ${isDarkMode 
                                ? 'hover:bg-red-500 hover:text-white' 
                                : 'hover:bg-red-500 hover:text-white'
                            }`}
                    />
                )}
            </div>

            {/* Search Result */}
            {filteredUser && (
                <div className={cardClass}>
                    <h1 className="text-lg font-bold font-poppins mb-3">Search Result</h1>
                    <div className={userRowClass}>
                        {/* User Info */}
                        <div className="flex items-center">
                            <Avatar
                                src={filteredUser.profilePic || profile1}
                                size="40"
                                round={true}
                            />
                            <div className="ml-3">
                                <h1 className="font-semibold text-sm">{filteredUser.name}</h1>
                                <p className={usernameClass}>@{filteredUser.username}</p>
                            </div>
                        </div>

                        <Link to={`/premium/profile/${filteredUser._id}`}>
                            <button className={buttonClass}>
                                Profile
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Follow Section */}
            <div className={cardClass}>
                <h1 className="text-lg font-bold font-poppins mb-3">Connect to people!</h1>
                {otherUsers?.map((user) => (
                    <div key={user?._id} className={userRowClass}>
                        {/* User Info */}
                        <div className="flex items-center">
                            <Avatar
                                src={user?.profilePic || profile1}
                                size="40"
                                round={true}
                            />
                            <div className="ml-3">
                                <h1 className="font-semibold text-sm">{user?.name}</h1>
                                <p className={usernameClass}>@{user?.username}</p>
                            </div>
                        </div>

                        <Link to={`/premium/profile/${user?._id}`}>
                            <button className={buttonClass}>
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

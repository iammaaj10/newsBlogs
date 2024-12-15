import React from 'react';
import { CiSearch } from 'react-icons/ci';
import Avatar from 'react-avatar';
import Profile from '../assets/profile.jpg';
import { Link } from 'react-router-dom';

const RigthBar = ({ otherUsers }) => {
    return (
        <div className='w-[20%]'>
            {/* Search Bar */}
            <div className='flex items-center bg-gray-200 rounded-full outline-none px-2'>
                <CiSearch size='20px' />
                <input type='text' placeholder='Search' className='outline-none bg-transparent p-2' />
            </div>

            
            <div className='p-4 bg-gray-200 rounded-xl outline-none w-full my-4'>
                <h1 className='text-lg font-bold font-poppins'>Follow to Explore More</h1>
                {otherUsers?.map((user) => {
                    return (
                        <div key={user?._id} className='flex items-center justify-between my-3'>
                            {/* User Info */}
                            <div className='flex items-center'>
                                <Avatar src={Profile} size='40' round={true} />
                                <div className='ml-2'>
                                    <h1 className='font-semibold'>{user.name}</h1>
                                    <p className='font-normal text-sm text-gray-600'>{user?.username}</p>
                                </div>
                            </div>

                            <Link to={`/premium/profile/${user?._id}`}>
                                <button className='bg-black text-white font-semibold py-1 px-4 rounded-full'>
                                     Profile
                                </button>
                            </Link>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RigthBar;

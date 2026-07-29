import React, { useState, useMemo } from 'react';
import { HiMagnifyingGlass, HiXMark, HiUserPlus, HiFire } from 'react-icons/hi2';
import Avatar from 'react-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profile1 from '../assets/profile.png';

const RightBar = ({ otherUsers = [] }) => {
    const { user } = useSelector((store) => store.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Live search filtering
    const filteredUsersList = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const query = searchTerm.toLowerCase().trim();
        return (otherUsers || []).filter(
            (u) =>
                u.name?.toLowerCase().includes(query) ||
                u.username?.toLowerCase().includes(query)
        );
    }, [searchTerm, otherUsers]);

    const clearSearch = () => {
        setSearchTerm('');
    };

    const trendingTopics = [
        { category: 'Technology', tag: '#AIandFuture', postsCount: '14.2K' },
        { category: 'Business', tag: '#GlobalMarkets', postsCount: '9.8K' },
        { category: 'Design', tag: '#EditorialUX', postsCount: '6.1K' },
        { category: 'Science', tag: '#SpaceExploration', postsCount: '11.5K' },
    ];

    return (
        <div className="w-full space-y-4 font-sans">
            {/* Live Search Bar */}
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 shadow-sm focus-within:border-slate-400 transition-colors">
                <HiMagnifyingGlass size={18} className="text-slate-400 flex-shrink-0 mr-2" />
                <input
                    type="text"
                    placeholder="Search creators & stories..."
                    className="w-full bg-transparent outline-none text-xs text-slate-900 placeholder-slate-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <HiXMark size={16} />
                    </button>
                )}
            </div>

            {/* Instant Search Results Box */}
            {searchTerm.trim() !== '' && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Matching Results ({filteredUsersList.length})
                    </h3>
                    {filteredUsersList.length > 0 ? (
                        <div className="space-y-2">
                            {filteredUsersList.map((u) => (
                                <div
                                    key={u._id}
                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Avatar src={u.profilePic || profile1} size="34" round className="border border-slate-200 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-xs text-slate-900 truncate">{u.name}</h4>
                                            <p className="text-[11px] text-slate-500 truncate">@{u.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate(`/premium/profile/${u._id}`);
                                            clearSearch();
                                        }}
                                        className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                    >
                                        Profile
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-2">No creators found</p>
                    )}
                </div>
            )}

            {/* Trending Topics Section */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <HiFire className="text-amber-500" size={18} />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <div
                            key={index}
                            className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                {topic.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {topic.tag}
                            </h4>
                            <span className="text-[10px] text-slate-400 block">{topic.postsCount} posts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Creators Section */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Suggested Creators</h3>
                    <HiUserPlus className="text-slate-400" size={18} />
                </div>

                <div className="space-y-3">
                    {otherUsers && otherUsers.length > 0 ? (
                        otherUsers.slice(0, 5).map((otherUser) => (
                            <div
                                key={otherUser?._id}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Avatar
                                        src={otherUser?.profilePic || profile1}
                                        size="36"
                                        round
                                        className="border border-slate-200 flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-xs text-slate-900 truncate">{otherUser?.name}</h4>
                                        <p className="text-[11px] text-slate-500 truncate">@{otherUser?.username}</p>
                                    </div>
                                </div>

                                <Link to={`/premium/profile/${otherUser?._id}`}>
                                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                                        Profile
                                    </button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-2">No creators available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RightBar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiBars3, HiXMark, HiArrowRight } from 'react-icons/hi2';
import Login from './Login';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        setShowLogin(true);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const navLinks = [
        { to: '/', label: 'Home', end: true },
        { to: '/news', label: 'News' },
        { to: '/tech', label: 'Tech' },
        { to: '/entertainment', label: 'Entertainment' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs font-sans">
            <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <div className="cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 font-outfit">
                        News<span className="text-indigo-600">Blogs</span>
                    </h1>
                </div>

                {/* Desktop Nav Links (Visible from md breakpoint and up) */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                                    isActive
                                        ? 'text-slate-900 bg-slate-100'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Right Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={handleLogin}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                        <span>Join Us</span>
                        <HiArrowRight size={14} />
                    </button>
                </div>

                {/* Mobile Menu Button (Only below md) */}
                <button
                    className="p-2 md:hidden rounded-xl text-slate-700 hover:bg-slate-100"
                    onClick={toggle}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu Panel */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={toggle}
                                className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <button
                            onClick={() => {
                                toggle();
                                handleLogin();
                            }}
                            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Join Us / Sign In</span>
                            <HiArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Login / Sign Up Modal */}
            {showLogin && <Login onClose={handleCloseLogin} />}
        </nav>
    );
};

export default Navbar;
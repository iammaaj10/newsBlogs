import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Login from './Login';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSignUpClick = () => {
        setShowSignUp(true);
    };
    const handleSignUpClick1 = () => {
        setShowSignUp(false);
    };

    const handleLogin = () => {
        setShowLogin(true);
    }
    const handleLogin1=()=>{
        setShowLogin(false);
    }

    return (
        <nav className="nav flex items-center justify-between p-3 lg:bg-neutral-800">
            <h2 className="text-2xl text-blue-400 font-bold">
                News<span className="text-3xl text-red-500 font-bold">B</span>logs
            </h2>

            <div className="hidden lg:flex gap-12">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `font-bold block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-gray-500" : "text-white"} hover:text-orange-700`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/news"
                    className={({ isActive }) =>
                        `font-bold block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-gray-500" : "text-white"} hover:text-orange-700`
                    }
                >
                    News
                </NavLink>
                <NavLink
                    to="/tech"
                    className={({ isActive }) =>
                        `font-bold block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-gray-500" : "text-white"} hover:text-orange-700`
                    }
                >
                    Tech
                </NavLink>
                <NavLink
                    to="/entertainment"
                    className={({ isActive }) =>
                        `font-bold block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-gray-500" : "text-white"} hover:text-orange-700`
                    }
                >
                    Entertainment
                </NavLink>
                <button
                    className="font-bold block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-700"
                    onClick={handleLogin}
                >
                    Premium
                </button>
            </div>

            <button className="hidden lg:flex border-gray-500 text-white bg-blue-800 rounded-md px-6 py-2 items-center hover:bg-gray-300 hover:border hover:border-gray-500 hover:text-black gap-2 group" onClick={handleLogin}>
                Join Us
                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition duration-300"></i>
            </button>

            <button className="p-3 lg:hidden" onClick={toggle}>
                <i className="fa-solid fa-bars"></i>
            </button>

            <div className={`${isOpen ? 'flex' : 'hidden'} fixed flex-col bg-neutral-800 top-0 right-0 p-3 z-10 lg:hidden w-3/4 h-full max-w-md`}>
                <div className="flex justify-between items-center relative">
                    <button className="p-3 absolute right-0 top-0" onClick={toggle}>
                        <i className="fa-solid fa-xmark text-white hover:text-red-500"></i>
                    </button>
                </div>

                <div className="mt-10 flex flex-col gap-9 p-3">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white"} border-b border-gray-100 hover:bg-gray-50 hover:text-orange-700`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/news"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white"} border-b border-gray-100 hover:bg-gray-50 hover:text-orange-700`
                        }
                    >
                        News
                    </NavLink>
                    <NavLink
                        to="/tech"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white"} border-b border-gray-100 hover:bg-gray-50 hover:text-orange-700`
                        }
                    >
                        Tech
                    </NavLink>
                    <NavLink
                        to="/entertainment"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white"} border-b border-gray-100 hover:bg-gray-50 hover:text-orange-700`
                        }
                    >
                        Entertainment
                    </NavLink>
                    <button
                        className="block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-700"
                        onClick={handleLogin}
                    >
                        Premium
                    </button>
                </div>

                <div className="mt-6">
                    <button className="border-gray-500 text-white bg-blue-800 rounded-md px-6 py-2 items-center hover:bg-gray-300 hover:border hover:border-gray-500 hover:text-black group" onClick={handleLogin}>
                        Join Us
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition duration-300"></i>
                    </button>
                </div>
            </div>

            
            {showLogin && <Login onClose={handleLogin1}
             />}
        </nav>
    );
};

export default Navbar;

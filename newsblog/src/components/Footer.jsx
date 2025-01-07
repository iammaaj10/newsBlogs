import React, { useState } from 'react';
import { FaXTwitter } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import Login from './Login';

const Footer = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [feedback, setFeedback] = useState(''); // State for feedback

  // Function to handle opening the sign-up form
  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  // Function to handle closing the sign-up form
  const handleSignUpClick1 = () => {
    setShowSignUp(false);
  };

  // Function to handle feedback submission
  const submitClick = () => {
    if (feedback.trim() === '') {
      toast.error('Please enter your feedback before submitting', { position: 'top-center' });
    } else {
      toast.success('Feedback submitted successfully', { position: 'top-center' });
      setFeedback(''); 
    }
  };

  return (
    <div className='bg-black w-full h-full p-3'>
      <div className='text-center'>
        <h1 className='text-xl text-violet-700 font-bold font-poppins'>Follow us on</h1>
      </div>
      <div className='flex gap-4 text-white p-3 items-center justify-center'>
        <div className='bg-violet-700 rounded-full px-[8px] py-[2px] transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black'>
          <i className="fa-brands fa-instagram cursor-pointer text-xl"></i>
        </div>
        <div className='bg-violet-700 rounded-full px-[8px] py-[2px] transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black'> 
          <i className="fa-brands fa-facebook cursor-pointer text-xl"></i>
        </div>
        <div className='bg-violet-700 rounded-full px-[8px] py-[7px] transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black'>
        <FaXTwitter className='cursor-pointer' />
        </div>
        <div className='bg-violet-700 rounded-full px-[8px] py-[2px] transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black'>
          <i className="fa-brands fa-github cursor-pointer text-xl"></i>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-20 mt-4'>
        <div className='max-w-xl'>
          <h1 className='text-violet-700 font-bold font-poppins text-xl mb-2'>About Us</h1>
          <p className='text-violet-700 text-md font-poppins'>
            NewsBlogs company started in 2024 with the ambition to provide the news and upload your blogs on our platform. Let's create a knowledgeable community and make your optimistic thoughts and put them on our platform and create a healthy environment...
          </p>
        </div>

        <div className='max-w-xl'>
          <h1 className='text-violet-700 font-bold font-poppins text-xl mb-2'>Contact Us</h1>
          <div className="flex flex-col gap-3">
            <i className="fa-solid fa-phone text-violet-700 font-md"> 9130304068</i>
            <i className="fa-solid fa-envelope text-violet-700 font-md"> not hosted yet</i>
          </div>

          <div className="flex mt-5">
            <input
              type="email"
              placeholder="Enter the Email "
              className="p-2 border border-violet-700 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button className="bg-violet-700 text-white font-semibold font-poppins p-2 rounded-r-2xl hover:bg-gray-500 hover:text-black">
              Send
            </button>
          </div>

          {/* Feedback Section */}
          <div className='mt-2 flex flex-col'>
            <label className='text-lg font-bold text-violet-600 font-poppins'>Enter Your Feedback</label>
            <textarea 
              name="feedback" 
              id="feedback" 
              className='w-60 h-24 rounded-lg' 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} // Update feedback on typing
            ></textarea>
            <div className='w-80'>
              <button 
                className='px-4 py-2 bg-violet-700 text-white font-bold font-poppins rounded-2xl hover:bg-gray-500 hover:text-black transition-transform hover:scale-105 mt-3 w-fit' 
                onClick={submitClick}
              >
                Submit
              </button>
            </div>
          </div>
          <ToastContainer autoClose={2000} />
        </div>

        <div className='p-2 max-w-2xl'>
          <h1 className='text-violet-700 font-bold font-poppins text-xl'>Register Now</h1>
          <button 
            className='bg-violet-700 text-white font-bold font-poppins rounded-full p-2 transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black' 
            onClick={handleSignUpClick}
          >
            Click Here
          </button>
          <p className='text-violet-700 text-md font-md font-poppins w-fit'>
            Hurry up and do the registration for the osm experience in the world of news and newsblogs !!!
          </p>
        </div>
      </div>

      <div className='mt-5 p-2 text-center'>
        <p className='text-violet-700 font-bold font-poppins'>
          Copyright &copy; 2025 Designed by <span className="text-gray-400 uppercase">maaj</span>
        </p>
      </div>

      {showSignUp && <Login onClose1={handleSignUpClick1} />}
    </div>
  );
};

export default Footer;

import React from 'react';
import { fashiondate } from '../assets/info';

const Fashion = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = 'http://www.pacorabanne.com/';
  };

  return (
    <div className='mt-10'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold font-poppins text-orange-500 uppercase'>Fashion defines the beauty</h1>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {fashiondate.map((item, index) => (
          <div key={index} className='rounded-lg p-2 overflow-hidden'>
            <img src={item.image} alt={`Fashion ${index}`} className='w-full h-full object-cover rounded-md shadow-lg' />
            <p className='text-center mt-2 text-gray-600'>{item.description}</p>
          </div>
        ))}

        <div className='col-span-1 md:col-start-3 md:row-start-2 rounded-lg p-3 overflow-hidden'>
          <div className='item-center justify-center bg-black rounded-lg p-3'>
            <h1 className='text-2xl font-bold text-violet-600 font-poppins text-center mt-2'>Make your fashion sense more enhanced</h1>
            <p className='text-xl font-semibold font-sans text-white'>
              Fashion defines the personality of a person; it enhances the beauty of a person.
            </p>
            <p className='text-xl font-semibold font-sans text-white'>
              Fashion is a way of expressing oneself through clothing and accessories. It is a form of self-expression!
            </p>
            <p className='text-xl font-semibold font-sans text-white'>
              Let's dive into the world of fashion. Click on the button to get more details and enjoy the world of fashion in the true sense...
            </p>
            <div className='text-center'>
              <button
                className='p-3 m-3 rounded-2xl bg-violet-700 text-white font-semibold hover:bg-gray-400 hover:text-black hover:border-gray-400 transition-transform transform hover:scale-105'
                onClick={handleSubmit}
              >
                Get More Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fashion;

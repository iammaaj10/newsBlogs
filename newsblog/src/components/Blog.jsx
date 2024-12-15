import React from 'react';
import { buttons } from '../assets/info';

const Blog = ({ selected, setSelected }) => {
  return (
    <div className='p-3 mt-10'>
      <h1 className='text-2xl items-start font-poppins font-semibold text-black'>Latest world news</h1>
      <div className='flex justify-between p-1 '>
        <p className='text-md font-semibold text-gray-400'>Don't miss the daily news</p>
        <div className='flex gap-3'>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}  
              className={`py-1 rounded-md lg:p-3 lg:rounded-2xl lg:m-2 font-bold ${selected === index ? 'bg-gray-400 text-black border-gray-400' : 'bg-orange-600 text-white border-orange-400'} hover:bg-gray-400 hover:text-black hover:border-gray-400`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

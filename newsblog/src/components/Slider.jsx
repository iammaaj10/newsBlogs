import React, { useEffect, useState } from 'react';
import { albumsData } from '../assets/info';

const Slider = ({ autoSlide = false, autoSlideInterval = 3000 }) => {
  const [cur, setCur] = useState(0);

  const prev = () => setCur((cur) => (cur === 0 ? albumsData.length - 1 : cur - 1));

  const next = () => setCur((cur) => (cur === albumsData.length - 1 ? 0 : cur + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [cur, autoSlide, autoSlideInterval]);

  return (
    <div className='overflow-hidden h-[50vh] lg:h-[90vh] w-full relative'>
      <div className='flex w-full h-full'>
        {albumsData.map(({ image, desc, btn }, index) => (
          <div
            key={index}
            className={`w-full h-full object-cover transition-transform duration-600 ease-in-out ${index === cur ? 'block' : 'hidden'}`}
          >
            <img
              src={image}
              alt={`slide-${index}`}
              className='w-full h-full object-cover opacity-90'
            />
            <div className='absolute lg:top-20 right-0 lg:text-start left-0 lg:left-36 p-3 hidden lg:block'>
              <button className='text-white bg-orange-700 rounded-lg p-3 font-bold'>{btn}</button>
            </div>
            <div className='absolute lg:top-36 left-0 lg:left-36 lg:w-1/4 lg:text-start text-white p-2 bg-black bg-opacity-50 rounded-lg hidden lg:block'>
              <p className='text-2xl font-bold w-fit'>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 z-1'>
        <button className='bg-white opacity-80 text-white p-2 px-4 rounded-full shadow hover:bg-white hover:opacity-100' onClick={prev}>
          <i className="fa-solid fa-arrow-left text-black font-bold"></i>
        </button>
        <button className='bg-white opacity-80 text-white p-2 px-4 rounded-full shadow hover:bg-white hover:opacity-100' onClick={next}>
          <i className="fa-solid fa-arrow-right text-black font-bold"></i>
        </button>
      </div>
      <div className='absolute bottom-4 right-0 left-0'>
        <div className='flex items-center justify-center gap-2'>
          {albumsData.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full ${cur === i ? 'p-2' : 'bg-opacity-50'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

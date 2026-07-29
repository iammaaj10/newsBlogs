import React, { useEffect, useState, useCallback } from 'react';
import { albumsData } from '../assets/info';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Slider = ({ autoSlide = true, autoSlideInterval = 4500 }) => {
  const [cur, setCur] = useState(0);

  const prev = useCallback(() => {
    setCur((c) => (c === 0 ? albumsData.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCur((c) => (c === albumsData.length - 1 ? 0 : c + 1));
  }, []);

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, next]);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl h-[420px] sm:h-[500px] lg:h-[580px] w-full shadow-lg group">
        
        {/* Slides */}
        {albumsData.map(({ image, desc, btn }, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === cur ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette Gradient Overlay */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Slide Content Box */}
            <div className="absolute bottom-10 left-6 sm:left-12 right-6 sm:right-12 max-w-2xl text-white space-y-3 z-20">
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
                {btn || 'Featured Story'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-outfit tracking-tight leading-tight text-white drop-shadow-md">
                {desc}
              </h2>
            </div>
          </div>
        ))}

        {/* Prev / Next Buttons */}
        <button
          onClick={prev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
        >
          <HiChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
        >
          <HiChevronRight size={20} />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 right-6 sm:right-12 z-30 flex items-center gap-2">
          {albumsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                cur === i ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

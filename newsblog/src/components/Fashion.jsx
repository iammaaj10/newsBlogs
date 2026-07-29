import React from 'react';
import { fashiondate } from '../assets/info';
import { HiArrowUpRight } from 'react-icons/hi2';

const Fashion = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.open('http://www.pacorabanne.com/', '_blank');
  };

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
          Lifestyle & Culture
        </span>
        <h2 className="text-3xl sm:text-4xl font-black font-outfit text-slate-900 tracking-tight">
          Style & Aesthetic Trends
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Discover how modern fashion defines personal expression and global culture.
        </p>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fashiondate.map((item, index) => (
          <div key={index} className="group rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all">
            <div className="overflow-hidden rounded-2xl h-64 w-full">
              <img
                src={item.image}
                alt={`Fashion ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-700 leading-relaxed text-center">
              {item.description}
            </p>
          </div>
        ))}

        {/* Feature Promo Card */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3 rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-4 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Exclusive Spotlight</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
              Elevate Your Fashion & Creative Perspective
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fashion is more than clothing; it is a canvas for identity and personality. Explore curated trends and editorial collections.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3.5 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all flex-shrink-0 shadow-sm"
          >
            <span>Explore Collections</span>
            <HiArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fashion;

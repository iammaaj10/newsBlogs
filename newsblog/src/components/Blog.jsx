import React from 'react';
import { buttons } from '../assets/info';

const Blog = ({ selected, setSelected }) => {
  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">Live Updates</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900 tracking-tight">
            Latest World Coverage
          </h2>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-xs ${
                selected === index
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

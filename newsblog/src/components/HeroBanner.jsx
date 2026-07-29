import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiSparkles, HiFire, HiClock, HiDocumentText } from 'react-icons/hi2';
import heroImg from '../assets/react1.jpg';
import sideImg1 from '../assets/react2.jpg';
import sideImg2 from '../assets/react4.jpg';

const HeroBanner = () => {
  const navigate = useNavigate();

  const trendingArticles = [
    {
      id: 1,
      category: 'TECHNOLOGY',
      title: 'Next-Gen AI Models Revolutionize Real-Time Language Translation',
      time: '4 min read',
      image: sideImg1,
    },
    {
      id: 2,
      category: 'GLOBAL MARKETS',
      title: 'Central Banks Signal New Policy Shift Amid Global Trade Rebalancing',
      time: '6 min read',
      image: sideImg2,
    },
  ];

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Hero Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Featured Banner (Cols 1-8) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[460px] lg:min-h-[520px] flex flex-col justify-end p-6 sm:p-10 lg:p-12 shadow-xl group">
          {/* Background Image with Dark Vignette Overlay */}
          <img
            src={heroImg}
            alt="Main Story"
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-sm">
                <HiSparkles size={13} />
                <span>Featured Cover</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                <HiClock size={13} />
                <span>5 min read</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit text-white leading-tight tracking-tight drop-shadow-md">
              The New Era of Journalism: How Independent Creators Are Reshaping News
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
              Explore breaking perspectives, verified investigative reports, and interactive community discussions updated live by creators worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/premium')}
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                <span>Read Full Coverage</span>
                <HiArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="px-5 py-3 text-xs font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl transition-all border border-white/20"
              >
                Start Writing
              </button>
            </div>
          </div>
        </div>

        {/* Trending Column (Cols 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <HiFire size={18} />
                </div>
                <h2 className="text-sm font-extrabold font-outfit text-slate-900 uppercase tracking-wider">
                  Trending Headlines
                </h2>
              </div>
              <span className="text-[11px] font-bold text-indigo-600">Live Updates</span>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {trendingArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigate('/premium')}
                  className="group cursor-pointer flex gap-3.5 items-start p-2.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200/60"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/70">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                      {article.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {article.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PRO Creator Pitch Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 flex items-center justify-between gap-3 mt-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                  Join The Community
                </span>
                <p className="text-xs font-bold text-slate-900">Have a story to publish?</p>
              </div>
              <button
                onClick={() => navigate('/premium')}
                className="px-3.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex-shrink-0 shadow-xs"
              >
                Publish Post
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Feature Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white">
            <HiDocumentText size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Verified Creators</h4>
            <p className="text-[11px] text-slate-500 font-medium">Original news, stories & opinions</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <HiSparkles size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Assistance</h4>
            <p className="text-[11px] text-slate-500 font-medium">Smart topic summaries & ideas</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="p-2.5 rounded-xl bg-orange-500 text-white">
            <HiFire size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Real-Time Discussions</h4>
            <p className="text-[11px] text-slate-500 font-medium">Instant comments & live likes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

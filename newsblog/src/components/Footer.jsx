import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaGithub, FaXTwitter } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Login from './Login';

const Footer = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');

  const submitFeedback = () => {
    if (!feedback.trim()) {
      return toast.error('Please enter your feedback before submitting.');
    }
    toast.success('Thank you! Feedback submitted successfully.');
    setFeedback('');
  };

  const submitNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error('Please enter your email address.');
    }
    toast.success('Subscribed to NewsBlogs digest!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-white font-outfit">
              News<span className="text-indigo-500">Blogs</span>
            </h2>
            <p className="text-xs leading-relaxed text-slate-400 font-normal">
              Empowering writers, journalists, and readers around the globe. Share your voice, explore breaking perspectives, and join a healthy community of optimistic thinkers.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a href="#" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <FaXTwitter size={16} />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <FaGithub size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Categories & Topics</h3>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="/news" className="hover:text-white transition-colors">World & National News</a></li>
              <li><a href="/tech" className="hover:text-white transition-colors">Technology & AI</a></li>
              <li><a href="/entertainment" className="hover:text-white transition-colors">Culture & Entertainment</a></li>
              <li><a href="/premium" className="hover:text-white transition-colors">PRO Creator Feed</a></li>
            </ul>
          </div>

          {/* Column 3: Newsletter Signup */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Stay Updated</h3>
            <p className="text-xs text-slate-400">Get top daily stories delivered directly to your inbox.</p>
            <form onSubmit={submitNewsletter} className="flex items-center">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-l-xl outline-none bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-slate-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-r-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Column 4: Feedback Box */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Send Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback helps us improve..."
              rows={3}
              className="w-full p-3 text-xs rounded-xl outline-none bg-slate-800 border border-slate-700 text-white placeholder-slate-500 resize-none focus:border-slate-500"
            />
            <button
              onClick={submitFeedback}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              Submit Feedback
            </button>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} NewsBlogs. Designed by <strong className="text-slate-300">MAAJ</strong></p>
          <div className="flex gap-6">
            <button onClick={() => setShowLogin(true)} className="hover:text-slate-300 transition-colors">
              Join Platform
            </button>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </footer>
  );
};

export default Footer;


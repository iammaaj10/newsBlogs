import React, { useState } from 'react';
import NewsSection from './NewsSection'; // Existing NewsSection component
import SportsSection from './SportsSection'; // New SportsSection component

const MainNews = () => {
  const [activeTab, setActiveTab] = useState('news'); // Default to news

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('news')} className="tab-button">
          News
        </button>
        <button onClick={() => setActiveTab('sports')} className="tab-button">
          Sports
        </button>
      </div>

      {activeTab === 'news' && <NewsSection />}
      {activeTab === 'sports' && <SportsSection />}
    </div>
  );
};

export default MainNews;

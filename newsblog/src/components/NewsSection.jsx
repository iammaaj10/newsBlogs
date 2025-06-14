import React, { useEffect, useState } from 'react';

const NewsSection = () => {
  const [techNews, setTechNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    const fetchAllNews = async () => {
      const endpoints = [
        `https://newsdata.io/api/1/news?apikey=${apiKey}&category=technology&language=en`,
        `https://newsdata.io/api/1/news?apikey=${apiKey}&category=world&language=en`,
      ];

      try {
        const [techRes, worldRes] = await Promise.all(endpoints.map(url => fetch(url)));

        if (!techRes.ok || !worldRes.ok) {
          throw new Error('One or more requests failed');
        }

        const techData = await techRes.json();
        const worldData = await worldRes.json();

        setTechNews(techData?.results || []);
        setWorldNews(worldData?.results || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllNews();
  }, [apiKey]);

  const renderNewsGrid = (newsArray) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsArray.map((article, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
        >
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-5 flex flex-col flex-1">
            <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
              {article.description || 'No description available.'}
            </p>
            <div className="mt-auto">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                📰 {article.source_id || 'Unknown'} • 🕒{' '}
                {new Date(article.pubDate).toLocaleDateString()}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 dark:bg-gray-800">
        <p className="text-xl font-semibold text-red-500 dark:text-red-300">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-8 lg:px-16 min-h-screen space-y-16">
      {/* Technology Section */}
      <section>
        <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-white mb-10">
           🌍 World News Headlines
        </h1>
        {techNews.length > 0 ? renderNewsGrid(techNews) : <p>No technology news found.</p>}
      </section>

      {/* World News Section */}
      <section>
        
        {worldNews.length > 0 ? renderNewsGrid(worldNews) : <p>No world news found.</p>}
      </section>
    </div>
  );
};

export default NewsSection;

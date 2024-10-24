import React, { useEffect, useState } from 'react';

const SportsSection = () => {
  const [commentary, setCommentary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCricketCommentary = async () => {
      const url = 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/41881/comm';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '036751a1bamshf51a274e719655ep1a1063jsnb095ccbc475c',
          'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result); // To inspect the structure of the API response

        if (result) {
          setCommentary(result); // Set the commentary data
        } else {
          console.error('No commentary data available');
          setCommentary(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cricket commentary', error);
        setLoading(false);
      }
    };

    fetchCricketCommentary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Cricket Commentary</h1>
      {commentary ? (
        <div className="border rounded-lg shadow-md overflow-hidden p-4">
          <h2 className="text-lg font-semibold mb-2">
            {commentary.matchHeader?.matchDescription || 'Match Commentary'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {commentary.matchHeader?.status || 'Status Unavailable'}
          </p>
          <h3 className="text-md font-semibold mb-2">Recent Commentary:</h3>
          <ul className="space-y-2">
            {commentary.commLines?.map((line, index) => (
              <li key={index} className="text-sm text-gray-700">
                {line.commentary || 'No commentary available'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No commentary available at the moment.</p>
      )}
    </div>
  );
};

export default SportsSection;

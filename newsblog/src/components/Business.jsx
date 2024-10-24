import React, { useEffect, useState } from 'react';

const Business = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const url = 'https://biztoc.p.rapidapi.com/news/source/bbc';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '036751a1bamshf51a274e719655ep1a1063jsnb095ccbc475c',
                    'x-rapidapi-host': 'biztoc.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();

                if (result && result.length > 0) {
                    setNews(result);
                } else {
                    setNews([]);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Latest Business News</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-600 mb-4">{item.summary}</p>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Read more
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Business;

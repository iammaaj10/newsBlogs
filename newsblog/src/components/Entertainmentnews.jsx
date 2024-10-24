import React, { useEffect, useState } from 'react';

const Entertainmentnews = () => {
    const [entertainment, setEntertainment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntertainment = async () => {
            const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '036751a1bamshf51a274e719655ep1a1063jsnb095ccbc475c',
                    'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();

                if (result && result.length > 0) {
                    setEntertainment(result);
                } else {
                    setEntertainment([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching entertainment news:', error);
                setLoading(false);
            }
        };
        fetchEntertainment();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (entertainment.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">No entertainment news available.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-extrabold text-center mb-8 text-white">Top 100 Entertainment News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {entertainment.map((item, index) => (
                    <div key={index} className="bg-neutral-900 text-white rounded-lg shadow-lg overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-sm mb-2"><strong>Year:</strong> {item.year}</p>
                            <p className="text-sm mb-4"><strong>Rating:</strong> {item.rating}</p>
                            <a
                                href={`https://www.imdb.com/title/${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                View on IMDb
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Entertainmentnews;

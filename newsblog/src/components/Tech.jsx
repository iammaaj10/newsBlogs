import React, { useState, useEffect } from 'react';

const Tech = () => {
    const [tech, setTech] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTech = async () => {
            const url = 'https://technology-news3.p.rapidapi.com/news';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '036751a1bamshf51a274e719655ep1a1063jsnb095ccbc475c',
                    'x-rapidapi-host': 'technology-news3.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();

                if (result && result.length > 0) {
                    setTech(result);
                } else {
                    setTech([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tech news:', error);
                setLoading(false);
            }
        };
        fetchTech();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (tech.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">No tech news available.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-6">
                <h2 className="text-4xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
                    Latest Tech News
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tech.map((item, index) => (
                    <div key={index} className="bg-neutral-900 text-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm mb-2"><strong>Published:</strong> {item.published}</p>
                        <p className="text-sm mb-4"><strong>Source:</strong> {item.source}</p>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            Read More
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tech;

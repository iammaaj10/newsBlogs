import React, { useEffect, useState } from 'react';
import { Star, Calendar, Eye, TrendingUp, ExternalLink } from 'lucide-react';

const EntertainmentNews = () => {
    const [entertainment, setEntertainment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieRatings, setMovieRatings] = useState({});

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
                    setEntertainment(result.slice(0, 20)); // Limit to 20 for better performance
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

    const fetchMovieRatings = async (movieId) => {
        if (movieRatings[movieId]) return movieRatings[movieId];

        const url = `https://movies-ratings2.p.rapidapi.com/ratings?id=${movieId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '6122aa9e30msh3bb261450f78279p17b651jsnbf8ccb3f7908',
                'x-rapidapi-host': 'movies-ratings2.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setMovieRatings(prev => ({ ...prev, [movieId]: result }));
            return result;
        } catch (error) {
            console.error('Error fetching movie ratings:', error);
            return null;
        }
    };

    const handleMovieClick = async (movie) => {
        setSelectedMovie(movie);
        await fetchMovieRatings(movie.id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
                    <p className="text-2xl font-semibold text-white animate-pulse">Loading Entertainment...</p>
                </div>
            </div>
        );
    }

    if (entertainment.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center items-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-2xl font-semibold text-white">No entertainment content available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10 container mx-auto px-6 py-16 text-center">
                    <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                        🎭 CINEMATIC UNIVERSE
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover the most captivating movies with detailed insights and ratings
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-16">
                {/* Movies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {entertainment.map((movie, index) => (
                        <div 
                            key={movie.id || index} 
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 cursor-pointer transform hover:-translate-y-2"
                            onClick={() => handleMovieClick(movie)}
                        >
                            {/* Rank Badge */}
                            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-black text-sm shadow-lg">
                                #{index + 1}
                            </div>

                            {/* Movie Poster */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                                    {movie.title}
                                </h3>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-300">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        <span>{movie.year}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="font-semibold">{movie.rating}</span>
                                    </div>
                                </div>

                                {/* Interactive Elements */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                    <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>View Details</span>
                                    </button>
                                    <a
                                        href={`https://www.imdb.com/title/${movie.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>IMDb</span>
                                    </a>
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Movie Detail Modal */}
            {selectedMovie && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMovie(null)}
                                className="absolute top-6 right-6 z-10 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>

                            {/* Modal Content */}
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 p-6">
                                    <img
                                        src={selectedMovie.image}
                                        alt={selectedMovie.title}
                                        className="w-full rounded-xl shadow-2xl"
                                    />
                                </div>
                                
                                <div className="md:w-2/3 p-6 space-y-6">
                                    <div>
                                        <h2 className="text-4xl font-black text-white mb-2">{selectedMovie.title}</h2>
                                        <div className="flex items-center space-x-6 text-gray-300">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-5 h-5 text-blue-400" />
                                                <span className="text-lg">{selectedMovie.year}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                <span className="text-lg font-bold">{selectedMovie.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Ratings */}
                                    {movieRatings[selectedMovie.id] && (
                                        <div className="bg-gray-800 rounded-xl p-6">
                                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                                                Detailed Ratings
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(movieRatings[selectedMovie.id]).map(([key, value]) => (
                                                    <div key={key} className="bg-gray-700 rounded-lg p-4">
                                                        <div className="text-sm text-gray-400 uppercase tracking-wide">{key}</div>
                                                        <div className="text-xl font-bold text-white">{value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <a
                                            href={`https://www.imdb.com/title/${selectedMovie.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-bold transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            <span>View on IMDb</span>
                                        </a>
                                        <button
                                            onClick={() => fetchMovieRatings(selectedMovie.id)}
                                            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                                        >
                                            <TrendingUp className="w-5 h-5" />
                                            <span>Load Ratings</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EntertainmentNews;
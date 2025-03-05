import React, { useState, useEffect } from 'react';
import "../movieratestyle.css";

const MovieRating = () => {
    const [movies, setMovies] = useState([]);
    const [userRatings, setUserRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');

    // Fetch both movies and ratings in parallel
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movies
                const moviesResponse = await fetch('http://127.0.0.1:5000/api/movies');
                
                if (!moviesResponse.ok) {
                    throw new Error('Failed to fetch movies');
                }
                
                const moviesData = await moviesResponse.json();
                setMovies(moviesData);
                
                // Only fetch ratings if user is logged in
                if (userId) {
                    const ratingsResponse = await fetch('http://127.0.0.1:5000/api/ratings', {
                        headers: { 'Authorization': `Bearer ${userId}` }
                    });
                    
                    if (ratingsResponse.ok) {
                        const data = await ratingsResponse.json();
                        // Convert array to object
                        const ratingsObj = {};
                        data.ratings.forEach(rating => {
                            ratingsObj[rating.movie_id] = rating.rating;
                        });
                        setUserRatings(ratingsObj);
                    }
                }
            } catch (err) {
                setError('Failed to load content. Please try again later.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [userId]);

    const handleRatingChange = async (movieId, rating) => {
        if (!userId) {
            setMessage('You must be logged in to rate movies');
            return;
        }
        
        setMessage('');
        try {
            const res = await fetch('http://127.0.0.1:5000/api/rate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userId}`
                },
                body: JSON.stringify({ movie_id: movieId, rating: parseInt(rating) })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                // Update local state immediately
                setUserRatings(prev => ({
                    ...prev,
                    [movieId]: parseInt(rating)
                }));
                setMessage('Rating saved!');
                setTimeout(() => setMessage(''), 2000);
            } else {
                setMessage(data.error || 'Failed to save rating');
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    // if (loading) return <div className="loading">Loading...</div>;
    // if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="movie-rating-container">
            <h2>Rate Movies</h2>
            {message && (
                <p className={message.includes('saved') ? 'success-message' : 'error-message'}>
                    {message}
                </p>
            )}
            
            {movies.length === 0 ? (
                <p>No movies found.</p>
            ) : (
                <div className="movies-list">
                    {movies.map(movie => (
                        <div key={movie._id} className="movie-item">
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>{movie.release_year}</p>
                                <p>{movie.genre.join(', ')}</p>
                                <p>{movie.description}</p>
                            </div>
                            
                            <div className="rating-controls">
                                <select 
                                    value={userRatings[movie._id] || ''}
                                    onChange={(e) => handleRatingChange(movie._id, e.target.value)}>
                                    <option value="">Rate</option>
                                    <option value="1">1 ⭐</option>
                                    <option value="2">2 ⭐</option>
                                    <option value="3">3 ⭐</option>
                                    <option value="4">4 ⭐</option>
                                    <option value="5">5 ⭐</option>
                                </select>
                                
                                {userRatings[movie._id] && (
                                    <span className="current-rating">
                                        Your rating: {userRatings[movie._id]}/5
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieRating;
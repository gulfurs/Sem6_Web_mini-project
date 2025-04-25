import React, { useState, useEffect } from 'react';
import "../movieratestyle.css";

const MovieRating = () => {
    const [movies, setMovies] = useState([]);
    const [userRatings, setUserRatings] = useState({});

    const userId = localStorage.getItem('userId');

    // Fetch both movies and ratings in parallel
    useEffect(() => {
        // Fetch movies
        fetch('http://127.0.0.1:5000/api/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
        
        // Fetch user ratings if logged in
        if (userId) {
            fetch('http://127.0.0.1:5000/api/ratings', {
                headers: { 'Authorization': `Bearer ${userId}` }
            })
            .then(response => response.json())
            .then(data => {
                const ratingsObj = {};
                data.ratings.forEach(rating => {
                    ratingsObj[rating.movie_id] = rating.rating;
                });
                setUserRatings(ratingsObj);
            });
        }
    }, [userId]);

    const handleRatingChange = async (movieId, rating) => {
        if (!userId) {return;}
        
            const res = await fetch('http://127.0.0.1:5000/api/rate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userId}`
                },
                body: JSON.stringify({ movie_id: movieId, rating: parseInt(rating) })
            });
            
            if (res.ok) {
                // Update local state immediately
                setUserRatings(prev => ({
                    ...prev,
                    [movieId]: parseInt(rating)
                }));
        }
    };

    return (
        <div className="movie-rating-container">
            <h2>Rate Movies</h2>
            
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
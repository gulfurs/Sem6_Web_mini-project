import React, { useState, useEffect } from 'react';
import "../movieratestyle.css";

const MovieRating = ({ user }) => {
    const [movies, setMovies] = useState([]);
    const [userRatings, setUserRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch movies from the database
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/movies', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const moviesData = await response.json();
                setMovies(moviesData);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
            }
        };

        fetchMovies();
    }, []);

    // Fetch user's ratings when component mounts
    useEffect(() => {
      const fetchUserRatings = async () => {
          const userId = localStorage.getItem('userId');
          
          if (!userId) {
              setError('You must be logged in to view ratings');
              setLoading(false);
              return;
          }
          
          try {
              const res = await fetch('http://127.0.0.1:5000/api/ratings', {
                  headers: {
                      'Authorization': `Bearer ${userId}`
                  }
              });
              
              if (res.ok) {
                  const data = await res.json();
                  // Convert array of ratings to an object for easier access
                  const ratingsObj = {};
                  data.ratings.forEach(rating => {
                      ratingsObj[rating.movie_id] = rating.rating;
                  });
                  setUserRatings(ratingsObj);
              } else {
                  setError('Failed to load ratings');
              }
          } catch (error) {
              console.error('Error fetching ratings:', error);
              setError('Failed to load your ratings');
          } finally {
              setLoading(false);
          }
      };
      
      // Call the function
      fetchUserRatings();
  }, [user]);

    const handleRatingChange = async (movieId, rating) => {
      const userId = localStorage.getItem('userId');
      
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
              // Update local state
              setUserRatings(prev => ({
                  ...prev,
                  [movieId]: parseInt(rating)
              }));
              setMessage('Rating saved successfully!');
              // Clear message after 3 seconds
              setTimeout(() => setMessage(''), 3000);
          } else {
              setMessage(data.error || 'Failed to save rating');
          }
      } catch (error) {
          console.error('Error saving rating:', error);
          setMessage('Error connecting to server');
      }
  };

    if (loading) {
        return <div className="loading">Loading movies and ratings...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movie-rating-container">
            <h2>Rate Movies</h2>
            {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
            
            {movies.length === 0 ? (
                <p>No movies found in the database.</p>
            ) : (
                <div className="movies-list">
                    {movies.map(movie => (
                        <div key={movie._id} className="movie-item">
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p className="movie-year">({movie.release_year})</p>
                                <p className="movie-genre">{movie.genre.join(', ')}</p>
                                <p className="movie-description">{movie.description}</p>
                            </div>
                            
                            <div className="rating-controls">
                                <label htmlFor={`rating-${movie._id}`}>Your Rating:</label>
                                <select 
                                    id={`rating-${movie._id}`}
                                    value={userRatings[movie._id] || ''}
                                    onChange={(e) => handleRatingChange(movie._id, e.target.value)}
                                >
                                    <option value="">Select rating</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                                
                                {userRatings[movie._id] && (
                                    <div className="current-rating">
                                        Your rating: <strong>{userRatings[movie._id]}/5</strong>
                                    </div>
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
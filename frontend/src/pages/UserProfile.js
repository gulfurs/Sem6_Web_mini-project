import React, { useState, useEffect } from "react";
import "../styles.css";
import "../home.css"


const UserProfile = () => {

  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const ratingsResponse = await fetch("http://127.0.0.1:5000/api/ratings", {
          headers: { Authorization: `Bearer ${userId}` },
        });
      
      if (!ratingsResponse.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const ratingsData = await ratingsResponse.json();

      const moviesWithRatings = await Promise.all(
        ratingsData.ratings.map(async (rating) => {
          const movieResponse = await fetch(`http://127.0.0.1:5000/api/movies/${rating.movie_id}`);
          if (movieResponse.ok) {
            const movieData = await movieResponse.json();
            return { ...movieData, userRating: rating.rating };
          } return null;
        })
      );
      setRatedMovies(moviesWithRatings.filter((movie) => movie !== null));
    } catch (err) {
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchUserRatings();
  } else {
    setLoading(false);
  }
}, [userId]);

  return (
    <div className="container">
      <h1>User Profile</h1>
      <p>Your personalized movie recommendations will appear here.</p>
      <p>Username: {localStorage.getItem("username")}</p>

      <div className="user-ratings-section">
        <h2>My Ratings</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && ratedMovies.length === 0 && <p>No ratings found</p>}

        {ratedMovies.length > 0 && (
          <div className="movies-grid">
            {ratedMovies.map(movie => (
              <div key={movie._id} className="movie-card">
                <h3>{movie.title}</h3>
                <p className="movie-year">{movie.release_year}</p>
                <p className="movie-genre">{movie.genre.join(', ')}</p>
                <div className="rating-display">
                  <p>Your Rating: {movie.userRating}/5 {Array(movie.userRating).fill('⭐').join('')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;

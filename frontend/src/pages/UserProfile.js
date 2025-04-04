import React, { useState, useEffect } from "react";
import "../styles.css";
import "../home.css"


const UserProfile = () => {

  const [ratedMovies, setRatedMovies] = useState([]);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!userId) return;
      const ratingsResponse = await fetch("http://127.0.0.1:5000/api/ratings", {
        headers: { Authorization: `Bearer ${userId}` },
      });

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
    };

    fetchUserRatings();
  }, [userId]);

  return (
    <div className="container">
      <h1>User Profile</h1>
      <p>Your rated movies</p>
      <p>Username: {username}</p>

      <div className="user-ratings-section">
        <h2>My Ratings</h2>
        {ratedMovies.length === 0 ? (
          <p>No ratings found</p>
        ) : (
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

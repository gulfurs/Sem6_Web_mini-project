import React from "react";
import "../styles.css";

const UserProfile = () => {
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

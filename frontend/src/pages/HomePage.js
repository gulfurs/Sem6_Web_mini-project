import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import "../home.css"

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    // fetch("http://127.0.0.1:5000/api/movies")
    //   .then(response => response.json())
    //   .then(data => setMovies(data));

      fetch("https://api.andrespecht.dev/movies")
        .then(response => response.json())
        .then(data => {
          if (data.success && data.response){
            setMovies(data.response);
          } 
        })
        .catch(error => console.error("Error fetching movies from API:", error));
  }, []);

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Welcome to the Cinematch</h1>
        <p>Very cool, you can even login ! :O</p>
      </div>
      {username && <p className="welcome-message">Welcome back, {username}!</p>}
  
      <div className="section-title">
        <h2>Movies</h2>
      </div>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-info">
              {movie.genre && <div>{movie.genre.join(', ')}</div>}
              {movie.release_year && <div>{movie.release_year}</div>}
              <div className="movie-description">{movie.description.slice(0, 100)}...</div>
            </div>
          </div>
        ))}
      </div>
  </div>
  );
};

export default HomePage;

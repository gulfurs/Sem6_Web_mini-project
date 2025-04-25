import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const HomePage = () => {
  // const [users, setUsers] = useState([]); 
  const [movies, setMovies] = useState([]);

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
      <div className= "top-bar sign-in">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
      <h1>Welcome to the Movie Recommendation Engine</h1>
      <p>Explore movies, join groups, and get personalized recommendations!</p>

      <nav>
        <Link to="/user-profile" className="btn">User Profile</Link>
        <Link to="/groups" className="btn">Groups</Link>
        <Link to="/group-join" className="btn">Join a Group</Link>
        <Link to="/movie-rating" className="btn">Rate Movies</Link>
      </nav>
  
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

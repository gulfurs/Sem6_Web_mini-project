import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const HomePage = () => {
  // const [users, setUsers] = useState([]); 
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/movies")
      .then(response => response.json())
      .then(data => setMovies(data));
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
  
      <h2>Movies</h2>
      <ul>
        {movies.map(movie =>(
          <li key={movie._id}>{movie.title}</li>
        ))}
      </ul>
      <p>Username: {localStorage.getItem("username")}</p>
    </div>
  );
};

export default HomePage;

import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Movie Recommendation Engine</h1>
      <p>Explore movies, join groups, and get personalized recommendations!</p>
      <nav>
        <Link to="/user-profile" className="btn">User Profile</Link>
        <Link to="/groups" className="btn">Groups</Link>
        <Link to="/group-join" className="btn">Join a Group</Link>
        <Link to="/movie-rating" className="btn">Rate Movies</Link>
      </nav>
    </div>
  );
};

export default HomePage;

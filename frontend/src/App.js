import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";

//Page imports
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Groups from "./pages/Groups";
import GroupJoin from "./pages/GroupJoin";
import MovieRating from "./pages/MovieRating";
import GroupView from "./pages/GroupView";

import Register from "./components/Register";
import Login from "./components/login";

import "./styles.css";
import "./navbarstyle.css"

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (userId && username) {
      setUser({ id: userId, username });
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
        <Link to="/" className="nav-logo">Cinematch</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {user && <Link to="/movie-rating">Rate Movies</Link>}
            {user && <Link to="/groups">Groups</Link>}
            {user && <Link to="/group-join">Join a Group</Link>}
            {user && <Link to="/user-profile">User-Profile</Link>}

          </div>
          <div className="auth-section">
            {user ? (
              <div className="user-section">
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </div>
            )}
          </div>
        </nav>
        
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            <Route path="/user-profile" element={
              <ProtectedRoute><UserProfile user={user} /> </ProtectedRoute> } />

            <Route path="/groups" element={
              <ProtectedRoute><Groups user={user} /></ProtectedRoute> } />
            
            <Route path="/group-join" element={
              <ProtectedRoute><GroupJoin user={user} /></ProtectedRoute> } />
            
            <Route path="/movie-rating" element={
              <ProtectedRoute><MovieRating user={user} /></ProtectedRoute>} />

            <Route path="/group/:groupId" element={
              <ProtectedRoute><GroupView user={user} /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
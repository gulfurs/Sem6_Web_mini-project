import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../navbarstyle.css";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);
        // Redirect to home page after successful registration
        navigate("/");
      } 
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
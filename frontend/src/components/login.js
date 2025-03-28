import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
            const res = await fetch("http://127.0.0.1:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await res.json();
            
            if (res.ok) {
                setUser(data.user);
                // Store user ID in localStorage
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                navigate("/");
            } 
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} 
                        onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
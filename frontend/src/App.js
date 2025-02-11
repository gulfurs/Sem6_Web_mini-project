import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Groups from "./pages/Groups";
import GroupJoin from "./pages/GroupJoin";
import MovieRating from "./pages/MovieRating";

import Register from "./components/Register";

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group-join" element={<GroupJoin />} />
        <Route path="/movie-rating" element={<MovieRating />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import "../styles.css";

const UserProfile = () => {
  return (
    <div className="container">
      <h1>User Profile</h1>
      <p>Your personalized movie recommendations will appear here.</p>
      <p>Username: {localStorage.getItem("username")}</p>
    </div>
  );
};

export default UserProfile;

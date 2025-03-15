import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const GroupView = () => {
  const [groupRatings, setGroupRatings] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [message, setMessage] = useState("");
  const { groupId } = useParams();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch group ratings
    fetch(`http://127.0.0.1:5000/api/group/${groupId}/ratings`, {
      headers: {
        Authorization: `Bearer ${userId}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.ratings) {
        setGroupRatings(data.ratings);
      }
    })
    .catch(() => {
      setMessage("Failed to load ratings");
    });

    // Fetch group info
    fetch("http://127.0.0.1:5000/api/groups", {
      headers: {
        Authorization: `Bearer ${userId}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const group = (data.all_groups || []).find(g => g._id === groupId);
      if (group) {
        setGroupInfo(group);
      }
    })
    .catch(() => {
      setMessage("Failed to load group info");
    });
  }, [groupId, userId]);

  // Group movies by title for better organization
  const moviesByTitle = {};
  groupRatings.forEach(rating => {
    const movieTitle = rating.movie?.title || "Unknown Movie";
    if (!moviesByTitle[movieTitle]) {
      moviesByTitle[movieTitle] = [];
    }
    moviesByTitle[movieTitle].push(rating);
  });

  return (
    <div>
      <h1>{groupInfo ? groupInfo.name : "Group"} Ratings</h1>
      {message && <p>{message}</p>}
      
      <div>
        {Object.keys(moviesByTitle).length === 0 ? (
          <p>No rated movies in this group yet.</p>
        ) : (
          <div>
            {Object.entries(moviesByTitle).map(([movie, ratings]) => (
              <div key={movie}>
                <h3>{movie}</h3>
                <ul>
                  {ratings.map(rating => (
                    <li key={rating._id}>
                      {rating.username}: {rating.rating}/5
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Link to="/groups">Back to Groups</Link>
    </div>
  );
};

export default GroupView;
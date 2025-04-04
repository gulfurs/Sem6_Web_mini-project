import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GroupJoin = () => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const userId = localStorage.getItem("userId");

  // Fetch all groups
  const fetchGroups = () => {
    fetch("http://127.0.0.1:5000/api/groups", {
      headers: { Authorization: `Bearer ${userId}`}
    })
    .then(res => res.json())
    .then(data => {
      console.log("Groups data:", data); // Debug what's coming back
      setGroups(data.all_groups || []);
      setUserGroups(data.user_groups || []);
    })
  };

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  // Join a group
  const handleJoinGroup = (groupId) => {
    fetch("http://127.0.0.1:5000/api/groups/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`
      },
      body: JSON.stringify({ group_id: groupId })
    })
    .then(res => res.json())
    .then(() => {
      // Refresh groups after joining
      fetchGroups();
    })
  };

  // Check if user is already a member of a group
  const isMember = (groupId) => {
    return userGroups.some(group => group._id === groupId);
  };

  return (
    <div className="container">
      <h1>Join a Group</h1>

      <div className="content">
        <h2>Available Groups</h2>
        {groups.length === 0 ? (
          <p>No groups found. {groups.length === 0 ? "Empty list." : `Found ${groups.length} groups.`}</p>
        ) : (
          <ul>
            {groups.map((group) => (
              <li key={group._id}>
                {group.name} ({(group.members || []).length} members)
                {isMember(group._id) ? (
                  <span> You're a member </span>
                ) : (
                  <button onClick={() => handleJoinGroup(group._id)} className="btn">
                    Join
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Link to="/groups" className="btn-back">Back to Your Groups</Link>
    </div>
  );
};

export default GroupJoin;
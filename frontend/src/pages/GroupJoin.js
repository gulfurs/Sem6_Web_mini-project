import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GroupJoin = () => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  // Fetch all groups
  const fetchGroups = () => {
    fetch("http://127.0.0.1:5000/api/groups", {
      headers: {
        Authorization: `Bearer ${userId}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("Groups data:", data); // Debug what's coming back
      setGroups(data.all_groups || []);
      setUserGroups(data.user_groups || []);
    })
    .catch(err => {
      console.error("Error fetching groups:", err);
      setGroups([]);
      setUserGroups([]);
    });
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
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to join group");
      }
      return res.json();
    })
    .then(() => {
      setMessage("Joined group");
      // Refresh groups after joining
      fetchGroups();
    })
    .catch(err => {
      console.error("Error joining group:", err);
      setMessage("Failed to join group");
    });
  };

  // Check if user is already a member of a group
  const isMember = (groupId) => {
    return userGroups.some(group => group._id === groupId);
  };

  return (
    <div>
      <h1>Join a Group</h1>
      {message && <p>{message}</p>}

      <div>
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
                  <button onClick={() => handleJoinGroup(group._id)}>
                    Join
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Link to="/groups">Back to Your Groups</Link>
    </div>
  );
};

export default GroupJoin;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Groups = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  // Fetch user's groups
  const fetchGroups = () => {
    fetch("http://127.0.0.1:5000/api/groups", {
      headers: {
        Authorization: `Bearer ${userId}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setUserGroups(data.user_groups || []);
    })
    .catch(err => {
      console.error("Error fetching groups:", err);
      setUserGroups([]);
    });
  };

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  // Create a group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    
    fetch("http://127.0.0.1:5000/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`
      },
      body: JSON.stringify({ name: groupName })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to create group");
      }
      return res.json();
    })
    .then(() => {
      setMessage("Group created");
      setGroupName("");
      
      // Refresh groups after creating
      fetchGroups();
    })
    .catch(err => {
      console.error("Error creating group:", err);
      setMessage("Failed to create group");
    });
  };

  // Leave a group
  const handleLeaveGroup = (groupId) => {
    fetch("http://127.0.0.1:5000/api/groups/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`
      },
      body: JSON.stringify({ group_id: groupId })
    })
    .then(() => {
      setUserGroups(userGroups.filter(g => g._id !== groupId));
      setMessage("Left group");
    })
    .catch(err => {
      console.error("Error leaving group:", err);
      setMessage("Failed to leave group");
    });
  };

  return (
    <div>
      <h1>Your Groups</h1>
      {message && <p>{message}</p>}

      <div>
        <h2>Create New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <button type="submit">Create Group</button>
        </form>
      </div>

      <div>
        <h2>Your Groups</h2>
        {userGroups.length === 0 ? (
          <p>You haven't joined any groups yet.</p>
        ) : (
          <ul>
            {userGroups.map((group) => (
              <li key={group._id}>
                <Link to={`/group/${group._id}`}>{group.name}</Link>
                <span> ({(group.members || []).length} members) </span>
                <button onClick={() => handleLeaveGroup(group._id)}>
                  Leave
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Link to="/group-join">Find more groups</Link>
    </div>
  );
};

export default Groups;
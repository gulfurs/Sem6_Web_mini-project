import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../navbarstyle.css"

const Groups = () => {
  return (
    <div className="container">
      <h1>Your Groups</h1>

      <div>
        <h2>Create New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <div className="form-group">
            <input type="text" placeholder="Group Name" value={groupName}
            onChange={(e) => setGroupName(e.target.value)} required />
            <button type="submit" className="btn">Create Group</button>
          </div>
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
                <Link to={`/group/${group._id}`} className="group-link">{group.name}</Link>
                <span> ({(group.members || []).length} members) </span>
                <button onClick={() => handleLeaveGroup(group._id)} className="logout-btn">
                  Leave
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Link to="/group-join" className="btn-back">Find more groups</Link>
    </div>
  );
};

export default Groups;

import React from "react";
import "../styles.css";

const GroupJoin = () => {
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

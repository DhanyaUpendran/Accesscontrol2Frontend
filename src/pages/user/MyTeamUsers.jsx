import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const MyTeamUsers = () => {
  const { permissions } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeamUsers = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/user/team-members`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setUsers(data);
      } catch (err) {
        console.error("Failed to load team users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamUsers();
  }, [token]);

  const removeUserFromTeam = async (userId) => {
    if (!window.confirm("Remove this user from your team?")) return;

    try {
      await axios.put(
        `${API_URL}/api/user/users/${userId}/remove-team`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to remove user", err);
      alert("You are not allowed to perform this action");
    }
  };

  if (loading) return <p className="status-text">Loading team members...</p>;

  return (
    <PermissionWrapper permissionKey="view_users" permissions={permissions}>
      <div className="team-users-container">
        <h3 className="team-users-title">Users in Your Team</h3>

        <ul className="team-users-list">
          {users.map((u) => (
            <li key={u._id} className="team-user-item">
              <div className="user-info">
                <strong>{u.name}</strong>
                <span>{u.email}</span>
              </div>

              <PermissionWrapper
                permissionKey="manage_users"
                permissions={permissions}
              >
                <button
                  className="remove-btn"
                  onClick={() => removeUserFromTeam(u._id)}
                >
                  Remove
                </button>
              </PermissionWrapper>
            </li>
          ))}
        </ul>
      </div>

      {/* Simple component styles */}
      <style>{`
        .team-users-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .team-users-title {
          font-size: 20px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .team-users-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-width: 600px;
        }

        .team-user-item {
          background: #ffffff;
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          color: #374151;
        }

        .user-info span {
          font-size: 13px;
          color: #6b7280;
        }

        .remove-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }

        .remove-btn:hover {
          background: #b91c1c;
        }

        .status-text {
          padding: 20px;
          font-size: 14px;
          color: #374151;
        }
      `}</style>
    </PermissionWrapper>
  );
};

export default MyTeamUsers;

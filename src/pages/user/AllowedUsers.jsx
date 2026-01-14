import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/userdetails`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="status-text">Loading users...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="users-container">
      <h1 className="users-title">Users</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.team?.name || "No Team"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simple component styles */}
      <style>{`
        .users-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .users-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .users-table th,
        .users-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
        }

        .users-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }

        .users-table tr:hover {
          background: #f9fafb;
        }

        .status-text {
          padding: 20px;
          font-size: 14px;
          color: #374151;
        }

        .error-text {
          padding: 20px;
          font-size: 14px;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default Users;

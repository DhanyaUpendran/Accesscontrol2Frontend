import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const UsersList = () => {
  const { permissions } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${API_URL}/api/user/userdetails`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // withCredentials: true,
        }
      );

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  return (
    <PermissionWrapper permissionKey="view_users" permissions={permissions}>
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
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.team?.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
      `}</style>
    </PermissionWrapper>
  );
};

export default UsersList;

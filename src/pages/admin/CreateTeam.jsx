// src/pages/admin/CreateTeam.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = "http://localhost:5000/api";

const CreateTeam = () => {
  const { permissions } = useContext(AuthContext);
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/admin/teams/create`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert("Team created");
      setName("");
    } catch (err) {
      console.error("Failed to create team", err);
      alert("Failed to create team");
    }
  };

  return (
    <PermissionWrapper
      permissionKey="manage_users"
      permissions={permissions}
    >
      <div className="team-container">
        <h1 className="team-title">Create Team</h1>

        <form onSubmit={handleSubmit} className="team-form">
          <input
            className="team-input"
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit" className="team-button">
            Create Team
          </button>
        </form>
      </div>

      {/* Simple component styles */}
      <style>{`
        .team-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .team-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .team-form {
          background: #ffffff;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .team-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }

        .team-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .team-button {
          width: 100%;
          padding: 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .team-button:hover {
          background: #1d4ed8;
        }
      `}</style>
    </PermissionWrapper>
  );
};

export default CreateTeam;

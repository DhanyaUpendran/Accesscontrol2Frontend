import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PERMISSIONS } from "../../../../../server/src/utils/constants.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = "http://localhost:5000/api";

const Roles = () => {
  const { permissions } = useContext(AuthContext);

  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName) return alert("Role name is required");

    try {
      await axios.post(
        `${API_URL}/admin/roles`,
        { name: newRoleName },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setNewRoleName("");
      fetchRoles();
    } catch {
      alert("Failed to create role");
    }
  };

  const handleAssignPermissions = async (roleId) => {
    if (!selectedPermissions.length) return alert("Select permissions");

    const perms = selectedPermissions.map((p) => ({
      permissionKey: p,
      scope: "global",
    }));

    try {
      await axios.put(
        `${API_URL}/admin/roles/${roleId}/permissions`,
        { permissions: perms },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setEditingRoleId(null);
      setSelectedPermissions([]);
      fetchRoles();
    } catch {
      alert("Failed to assign permissions");
    }
  };

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  return (
    <PermissionWrapper permissionKey="manage_roles" permissions={permissions}>
      <div className="roles-container">
        <h1 className="roles-title">Roles</h1>

        <div className="create-role">
          <h2>Create New Role</h2>
          <input
            placeholder="Role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button onClick={handleCreateRole}>Create Role</button>
        </div>

        <div className="roles-list">
          <h2>Existing Roles</h2>

          {roles.map((role) => (
            <div key={role._id} className="role-card">
              <div className="role-header">
                <strong>{role.name}</strong>
                <button onClick={() => setEditingRoleId(role._id)}>
                  Edit Permissions
                </button>
              </div>

              {editingRoleId === role._id && (
                <div className="permissions-box">
                  {Object.values(PERMISSIONS).map((p) => (
                    <label key={p}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(p)}
                        onChange={() => togglePermission(p)}
                      />
                      {p}
                    </label>
                  ))}
                  <button
                    className="save-btn"
                    onClick={() => handleAssignPermissions(role._id)}
                  >
                    Save Permissions
                  </button>
                </div>
              )}

              <div className="current-perms">
                <strong>Current Permissions:</strong>{" "}
                {role.permissions?.map((p) => p.permissionKey).join(", ") ||
                  "None"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple component styles */}
      <style>{`
        .roles-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
          flex-direction: column;
          align-items:center;
        }

        .roles-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .create-role {
          background: #ffffff;
          padding: 16px;
          max-width: 400px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .create-role input {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }

        .create-role button {
          padding: 8px 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .roles-list h2 {
          margin-bottom: 12px;
        }

        .role-card {
          background: #ffffff;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .role-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .role-header button {
          background: #374151;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
        }

        .permissions-box {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          background: #f9fafb;
        }

        .permissions-box label {
          display: block;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .permissions-box input {
          margin-right: 6px;
        }

        .save-btn {
          margin-top: 8px;
          background: #16a34a;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .current-perms {
          margin-top: 8px;
          font-size: 14px;
          color: #374151;
        }
      `}</style>
    </PermissionWrapper>
  );
};

export default Roles;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PERMISSIONS } from "../../utils/permission";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const Roles = () => {
  const { permissions } = useContext(AuthContext);

  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);

  // NEW
  const [scopeMap, setScopeMap] = useState({});
  const [timeMap, setTimeMap] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data } = await axios.get(`${API_URL}/api/admin/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoles(data);
  };

  const handleCreateRole = async () => {
    if (!newRoleName) return alert("Role name required");

    await axios.post(
      `${API_URL}/api/admin/roles`,
      { name: newRoleName },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewRoleName("");
    fetchRoles();
  };

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  const handleAssignPermissions = async (roleId) => {
    if (!selectedPermissions.length) return alert("Select permissions");

    const perms = selectedPermissions.map((p) => ({
      permissionKey: p,
      scope: scopeMap[p] || "self",
      startsAt: timeMap[p]?.startsAt || null,
      endsAt: timeMap[p]?.endsAt || null,
    }));

    await axios.put(
      `${API_URL}/api/admin/roles/${roleId}/permissions`,
      { permissions: perms },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingRoleId(null);
    setSelectedPermissions([]);
    setScopeMap({});
    setTimeMap({});
    fetchRoles();
  };

  return (
    <PermissionWrapper permissionKey="manage_roles" permissions={permissions}>
      <div className="roles-container">
        <h1>Roles</h1>

        {/* CREATE ROLE */}
        <div className="create-role">
          <input
            placeholder="Role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button onClick={handleCreateRole}>Create Role</button>
        </div>

        {/* ROLE LIST */}
        {roles.map((role) => (
          <div key={role._id} className="role-card">
            <div className="role-header">
              <strong>{role.name}</strong>
              <button onClick={() => setEditingRoleId(role._id)}>
                Edit Permissions
              </button>
            </div>

            {/* EDIT PERMISSIONS */}
            {editingRoleId === role._id && (
              <div className="permissions-box">
                {Object.values(PERMISSIONS).map((p) => {
                  const selected = selectedPermissions.includes(p);

                  return (
                    <div key={p} className="perm-row">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => togglePermission(p)}
                      />

                      <span>{p}</span>

                      {selected && (
                        <>
                          <select
                            value={scopeMap[p] || "self"}
                            onChange={(e) =>
                              setScopeMap({
                                ...scopeMap,
                                [p]: e.target.value,
                              })
                            }
                          >
                            <option value="self">Self</option>
                            <option value="team">Team</option>
                            <option value="global">Global</option>
                          </select>

                          <input
                            type="datetime-local"
                            onChange={(e) =>
                              setTimeMap({
                                ...timeMap,
                                [p]: {
                                  ...timeMap[p],
                                  startsAt: e.target.value,
                                },
                              })
                            }
                          />

                          <input
                            type="datetime-local"
                            onChange={(e) =>
                              setTimeMap({
                                ...timeMap,
                                [p]: {
                                  ...timeMap[p],
                                  endsAt: e.target.value,
                                },
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                  );
                })}

                <button onClick={() => handleAssignPermissions(role._id)}>
                  Save
                </button>
              </div>
            )}

            {/* CURRENT PERMISSIONS */}
            <div className="current-perms">
              <strong>Current:</strong>
              {role.permissions?.length ? (
                role.permissions.map((p) => {
                  const expired =
                    p.endsAt && new Date(p.endsAt) < new Date();

                  return (
                    <div key={p.permissionKey}>
                      <span
                        style={{
                          color: expired ? "red" : "green",
                          textDecoration: expired ? "line-through" : "none",
                        }}
                      >
                        {p.permissionKey} ({p.scope})
                      </span>
                      {expired && " ⛔ expired"}
                    </div>
                  );
                })
              ) : (
                <span> None</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .roles-container { padding:20px }
        .create-role input { margin-right:6px }
        .role-card { background:#fff; padding:12px; margin-bottom:10px }
        .role-header { display:flex; justify-content:space-between }
        .permissions-box { margin-top:10px }
        .perm-row { display:flex; gap:8px; margin-bottom:6px }
      `}</style>
    </PermissionWrapper>
  );
};

export default Roles;

// src/pages/admin/CreateUser.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = "http://localhost:5000/api";

const CreateUser = () => {
  const { permissions } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRoles();
    fetchTeams();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setRoles(data);
    } catch (err) {
      console.error("Failed to load roles", err);
      setError("Failed to load roles");
    }
  };

  const fetchTeams = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/teams`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams", err);
      setError("Failed to load teams");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate required fields
    if (!name.trim() || !email.trim() || !password.trim() || !selectedRole) {
      setError("Name, email, password, and role are required");
      setLoading(false);
      return;
    }

    try {
      // Create user with team
      const { data: newUser } = await axios.post(
        `${API_URL}/admin/users`,
        {
          name,
          email,
          password, // backend handles hashing
          roles: [{ roleId: selectedRole }],
          teamId: selectedTeam || null, // optional
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSuccess("User created successfully 🎉");
      setName("");
      setEmail("");
      setPassword("");
      setSelectedRole("");
      setSelectedTeam("");
    } catch (err) {
      console.error("Failed to create user", err);
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionWrapper permissionKey="manage_users" permissions={permissions}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create User</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Team (optional)</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </PermissionWrapper>
  );
};

const styles = {
  form: {
    maxWidth: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 8,
    
  },
  input: {
    padding: 8,
    fontSize: 16,
  },
  select: {
    padding: 8,
    fontSize: 16,
  },
  button: {
    padding: 10,
    fontSize: 16,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

export default CreateUser;

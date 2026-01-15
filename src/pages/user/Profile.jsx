import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true,
      });

      setProfile(data);
      setForm({ name: data.name, email: data.email });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleUpdate = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/user/users/${profile._id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setEditMode(false);
      fetchProfile();
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("Permission not allowed");
      } else {
        setError("Update failed");
      }
    }
  };

  if (!profile) return <p className="status-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        {editMode ? (
          <>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Team:</strong> {profile.team?.name || "None"}</p>

            {/* Visible to ALL users */}
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>

      <style>{`
        .profile-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .profile-card {
          background: white;
          max-width: 400px;
          padding: 16px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        input {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          padding: 6px;
        }

        button {
          margin-right: 8px;
          padding: 6px 12px;
          cursor: pointer;
        }

        .error-text {
          margin-top: 10px;
          color: red;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default Profile;

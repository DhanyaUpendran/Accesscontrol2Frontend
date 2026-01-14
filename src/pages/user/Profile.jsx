import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  if (!profile) return <p className="status-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Team:</strong> {profile.team?.name || "None"}
        </p>
      </div>

      {/* Simple component styles */}
      <style>{`
        .profile-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .profile-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .profile-card {
          background: #ffffff;
          max-width: 400px;
          padding: 16px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          font-size: 14px;
          color: #374151;
        }

        .profile-card p {
          margin-bottom: 8px;
        }

        .status-text {
          padding: 20px;
          font-size: 14px;
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default Profile;

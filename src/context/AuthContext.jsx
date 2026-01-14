import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

   const fetchProfile = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    console.log("PROFILE API RESPONSE:", data); // 🔥 ADD THIS

    setUser(data);

    setPermissions(
      (data.permissions || []).map(p => ({
        permissionKey: p
      }))
    );
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    localStorage.removeItem("token");
    setUser(null);
    setPermissions([]);
  }
};


    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, permissions, setPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

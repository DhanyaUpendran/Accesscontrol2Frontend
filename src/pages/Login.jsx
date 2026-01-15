import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const Login = () => {
  const { setUser, setPermissions } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "permissions",
        JSON.stringify(data.permissions || [])
      );

      // update context
      setUser(data.user);
      setPermissions(data.permissions || []);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

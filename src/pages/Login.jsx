import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { setUser, setPermissions } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "permissions",
        JSON.stringify(data.permissions || [])
      );

      setUser(data.user);
      setPermissions(data.permissions || []);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>

      {/* Styles at the bottom */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f6f8;
        }

        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-form {
          background: #ffffff;
          padding: 30px;
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .login-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .login-form input:focus {
          outline: none;
          border-color: #007bff;
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          background: #007bff;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .login-form button:hover {
          background: #0056b3;
        }
      `}</style>
    </>
  );
};

export default Login;

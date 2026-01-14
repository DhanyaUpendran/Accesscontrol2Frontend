import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { SIDEBAR_ITEMS } from "../utils/permission.js";
import { hasPermission } from "../utils/permission";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUser, setPermissions, permissions } = useContext(AuthContext);

  const canView = (itemPerms) => {
    if (!itemPerms || itemPerms.length === 0) return true;
    return itemPerms.some((perm) => hasPermission(permissions, perm));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPermissions([]);
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Dashboard</div>

      <ul className="sidebar-menu">
        {SIDEBAR_ITEMS.map(
          (item) =>
            canView(item.permissions) && (
              <li key={item.path}>
                <Link to={item.path} className="sidebar-link">
                  {item.label}
                </Link>
              </li>
            )
        )}
      </ul>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Simple component styles */}
      <style>{`
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: #1f2937;
          color: white;
          display: flex;
          flex-direction: column;
        }

        .sidebar-title {
          padding: 16px;
          font-size: 18px;
          font-weight: bold;
          border-bottom: 1px solid #374151;
        }

        .sidebar-menu {
          list-style: none;
          padding: 16px;
          margin: 0;
          flex: 1;
        }

        .sidebar-menu li {
          margin-bottom: 8px;
        }

        .sidebar-link {
          display: block;
          padding: 10px 12px;
          border-radius: 4px;
          color: #e5e7eb;
          text-decoration: none;
          font-size: 14px;
        }

        .sidebar-link:hover {
          background: #374151;
          color: white;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #374151;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: #b91c1c;
        }
      `}</style>
    </nav>
  );
};

export default Sidebar;

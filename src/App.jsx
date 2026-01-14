import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";

// Auth
import Login from "./pages/Login.jsx";

// Layout
import Dashboard from "./pages/user/Dashboard.jsx";

// User Pages
import Profile from "./pages/user/Profile.jsx";
import AllowedUsers from "./pages/user/AllowedUsers.jsx";

// Admin Pages
import UserList from "./pages/admin/UserList.jsx";
import CreateUser from "./pages/admin/CreateUser.jsx";
import Roles from "./pages/admin/Roles.jsx";
import AuditLogs from "./pages/admin/AuditLogs.jsx";
import CreateTeam from "./pages/admin/CreateTeam.jsx";
import MyTeamUsers from "./pages/user/MyTeamUsers.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Layout (Protected) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Default page */}
            <Route index element={<Profile />} />

            {/* User */}
            <Route path="profile" element={<Profile />} />
            <Route path="Userview" element={<AllowedUsers />} />
            <Route path="user/teamupdate" element={<MyTeamUsers />} />


            {/* Admin */}
            <Route path="admin/users" element={<UserList />} />
            <Route path="admin/create-user" element={<CreateUser />} />
            <Route path="admin/roles" element={<Roles />} />
             <Route path="admin/team" element={<CreateTeam />} />
            <Route path="admin/audit-logs" element={<AuditLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

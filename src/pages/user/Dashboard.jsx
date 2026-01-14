import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Page content */}
      <main className="dashboard-content">
        <Outlet />
      </main>

      {/* Dashboard styles */}
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f3f4f6;
        }

        .dashboard-content {
          flex: 1;
          padding: 20px;
          background-color: #f9fafb;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

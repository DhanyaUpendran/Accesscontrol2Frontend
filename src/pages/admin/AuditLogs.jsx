import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import PermissionWrapper from "../../components/PermissionWrapper.jsx";

const API_URL = "http://localhost:5000/api";

const AuditLogs = () => {
  const { permissions } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${API_URL}/admin/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    }
  };

  return (
    <PermissionWrapper
      permissionKey="view_audit_logs"
      permissions={permissions}
    >
      <div className="audit-container">
        <h1 className="audit-title">Audit Logs</h1>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Action</th>
              <th>Metadata</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.actor?.email || "System"}</td>
                <td>{log.action}</td>
                <td className="metadata">
                  {JSON.stringify(log.metadata)}
                </td>
                <td>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple component styles */}
      <style>{`
        .audit-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .audit-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .audit-table th,
        .audit-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
        }

        .audit-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }

        .audit-table tr:hover {
          background: #f9fafb;
        }

        .metadata {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6b7280;
        }
      `}</style>
    </PermissionWrapper>
  );
};

export default AuditLogs;

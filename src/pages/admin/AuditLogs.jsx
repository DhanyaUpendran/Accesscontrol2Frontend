import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import PermissionWrapper from "../../components/PermissionWrapper";

const API_URL = import.meta.env.VITE_API_URL;

const AuditLogs = () => {
  const { permissions } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <PermissionWrapper
      permissionKey="view_audit_logs"
      permissions={permissions}
    >
      <div className="audit-page">
        <h2>Audit Logs</h2>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Action</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <React.Fragment key={log._id}>
                <tr onClick={() => toggleExpand(log._id)}>
                  <td>{log.actor?.email || "System"}</td>
                  <td>
                    <span className="badge">{log.action}</span>
                  </td>
                  <td className="ellipsis">
                    {JSON.stringify(log.details)}
                  </td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>

                {expandedRow === log._id && (
                  <tr className="expanded">
                    <td colSpan="4">
                      <pre>
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .audit-page {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        h2 {
          margin-bottom: 16px;
          color: #111827;
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          text-align: left;
        }

        th {
          background: #f3f4f6;
          font-weight: 600;
        }

        tr:hover {
          background: #f9fafb;
          cursor: pointer;
        }

        .badge {
          background: #2563eb;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .ellipsis {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6b7280;
        }

        .expanded td {
          background: #111827;
          color: #e5e7eb;
        }

        pre {
          margin: 0;
          font-size: 13px;
          overflow-x: auto;
        }
      `}</style>
    </PermissionWrapper>
  );
};

export default AuditLogs;

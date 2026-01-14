import { Navigate } from "react-router-dom";
import PermissionDenied from "../components/PermissionDenied";
import { hasPermission } from "../utils/permission";

export default function PrivateRoute({ children, permission }) {
  const token = localStorage.getItem("token");
  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || [];

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no permission
  if (permission && !hasPermission(permissions, permission)) {
    return <PermissionDenied />;
  }

  return children;
}

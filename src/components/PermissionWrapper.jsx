// import React from "react";

import React from "react";

const PermissionWrapper = ({ permissionKey, permissions, children }) => {
  if (!permissions) return null; // still loading
  if (permissions.length === 0) return null; // still loading

  const hasPermission = permissions.some(
    (p) => p.permissionKey === permissionKey
  );

  if (!hasPermission) {
    return (
      <div className="text-red-500 font-bold">
        Permission Denied
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionWrapper;

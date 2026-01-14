export const PERMISSIONS = {
  VIEW_PROFILE: "view_profile",
 MANAGE_PROFILE: "manage_profile",
  VIEW_USERS: "view_users",
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  MANAGE_TEAMS: "manage_teams",
  VIEW_AUDIT_LOGS: "view_audit_logs"
};

export const SCOPES = {
  SELF: "self",
  TEAM: "team",
  GLOBAL: "global"
};

export const SIDEBAR_ITEMS = [
  // { label: "Dashboard", path: "/dashboard", permissions: [] },

  {
    label: "My Profile",
    path: "/dashboard/profile",
    permissions: [PERMISSIONS.VIEW_PROFILE],
  },
  {
    label: "Manage Users",
    path: "/dashboard/admin/users",
    permissions: [PERMISSIONS.MANAGE_USERS],
  },
  {
    label: "Create User",
    path: "/dashboard/admin/create-user",
    permissions: [PERMISSIONS.MANAGE_USERS],
  },
  {
    label: "Roles",
    path: "/dashboard/admin/roles",
    permissions: [PERMISSIONS.MANAGE_ROLES],
  },
   {
    label: "Create Teams",
    path: "/dashboard/admin/team",
    permissions: [PERMISSIONS.MANAGE_TEAMS],
  },
   {
    label: "Your Team",
    path: "/dashboard/user/teamupdate",
    permissions: [PERMISSIONS.MANAGE_TEAMS],
  },
  {
    label: "Audit Logs",
    path: "/dashboard/admin/audit-logs",
    permissions: [PERMISSIONS.VIEW_AUDIT_LOGS],
  },
];

export const hasPermission = (permissions, key) => {
  if (!permissions || !key) return false;

  return permissions.some(p =>
    typeof p === "string"
      ? p === key
      : p.permissionKey === key
  );
};

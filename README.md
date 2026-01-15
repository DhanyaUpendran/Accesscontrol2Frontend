# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





---------------------Project Overview------------------------------
This frontend is a React (Vite) application built as part of a MERN-based access control system.
The goal of this project is to demonstrate a working prototype with clean UI, clean code, and correct access enforcement.

The frontend enforces role- and permission-based access control at the UI level, ensuring users:

1.Only see navigation items they are allowed to access

2.Cannot access restricted routes via URL manipulation

3.Cannot trigger unauthorized actions from the UI
All critical authorization decisions are still enforced by the backend; the frontend acts as a defense-in-depth layer and improves UX clarity.

----------------------------------Tech Stack------------------

React (Vite)

React Router

Context API

Axios

Plain CSS (component-scoped styles)

----------------------Project Structure----------------------------
src/
├── assets/                 # Static assets
├── components/             # Reusable UI components
│   ├── PermissionWrapper.jsx
│   ├── PermissionDenied.jsx
│   └── Sidebar.jsx
├── context/
│   └── AuthContext.jsx     # Auth & permission state
├── pages/
│   ├── admin/              # Admin-only pages
│   │   ├── UsersList.jsx
│   │   ├── Roles.jsx
│   │   ├── CreateUser.jsx
│   │   ├── CreateTeam.jsx
│   │   └── AuditLogs.jsx
│   └── user/               # User-scoped pages
│       ├── Dashboard.jsx
│       ├── Profile.jsx
│       ├── AllowedUsers.jsx
│       └── MyTeamUsers.jsx
├── routes/
│   └── PrivateRoute.jsx    # Route protection
├── utils/
│   └── permission.js       # Permission constants & helpers
├── App.jsx
├── main.jsx
└── App.css

------------------------------Authentication & Global State---------------------
AuthContext.jsx:
----Purpose:

Manages authentication state

Stores the logged-in user and active permissions

Persists session using JWT stored in localStorage

----How it works:

Reads JWT from localStorage

Calls /api/user/profile

Stores user info and permissions in context

Exposes permissions to the entire app

-----Why Context API:

Lightweight and sufficient for project scope

Avoids unnecessary state management libraries

Keeps permission logic centralized.

------------------------------------------Route-Level Access Enforcement-------------------------
PrivateRoute.jsx:

----Purpose:

Prevents access to protected routes

Blocks unauthenticated users

Enforces permission checks at navigation level

-----Behavior:

Redirects unauthenticated users to /login

Displays PermissionDenied if permission is missing

Renders the protected component if authorized

------This ensures users cannot bypass restrictions by typing URLs directly.


------------------UI-Level Permission Enforcement---------------------
PermissionWrapper.jsx:
--Purpose:
Conditionally renders UI based on permissions

--How it works:

Reads permissions from AuthContext

Checks required permission key

Renders children only if authorized

---This prevents:

Unauthorized buttons

Unauthorized actions

Confusing UI states

---------PermissionDenied.jsx:
Displays a clear access-denied message

Used by route guards and wrappers

Simple and explicit to avoid silent failures.
------------------------------------------Navigation Control------------------
Sidebar.jsx:

---Purpose:

Dynamically renders navigation items

Ensures users only see links they have permission to access

---How it works:

Uses SIDEBAR_ITEMS from permission.js

Filters items using hasPermission

Automatically updates UI based on user role

This improves usability while reinforcing authorization boundaries.


-------------------------------------Permission Utilities------------------------------
utils/permission.js:


       Purpose:

Central source of permission constants

Prevents hard-coded strings across the app

Ensures frontend permissions match backend permissions

          Includes:

PERMISSIONS

SIDEBAR_ITEMS

hasPermission() helper

This file guarantees consistency between backend and frontend authorization rules.

-------------------------Admin Pages (Permission-Protected)----------------


All admin pages are protected at two levels:

Route-level protection (PrivateRoute)

UI-level protection (PermissionWrapper)

Each page explicitly declares the permission it requires.

->UsersList.jsx:

Permission: view_users

Fetches users via /api/user/userdetails

Displays name, email, and team

Read-only access

->Roles.jsx

Permission: manage_roles

Create new roles

Assign permissions dynamically

Uses centralized permission constants

->CreateUser.jsx

Permission: manage_users

Creates users

Assigns roles and optional teams

Backend handles password hashing

->CreateTeam.jsx

Permission: manage_users

Creates teams

Simple admin-only operation

->AuditLogs.jsx

Permission: view_audit_logs

Displays security-relevant system actions

Read-only administrative visibility

User Pages
->Dashboard.jsx

Layout wrapper

Renders sidebar and nested routes

->Profile.jsx

Displays and updates user profile

->AllowedUsers.jsx

Shows users visible based on permission scope

->MyTeamUsers.jsx

Displays team members

Actions gated by permission checks

--------------------------Environment Variables---------------
Create a .env file in the frontend root:

VITE_API_URL=http://localhost:5000



---------------------------Summary-------------------

This frontend demonstrates:

Clean separation of concerns

Correct UI-level access enforcement

Strong alignment with backend authorization

A working, review-ready prototype.
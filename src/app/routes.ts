import React from "react";
import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/Dashboard";
import WorkspacesBrowse from "./pages/WorkspacesBrowse";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import NotFound from "./pages/NotFound";
import SecurityDashboard from "./pages/SecurityDashboard";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import PortalLayout from "./layouts/PortalLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWorkspaces from "./pages/admin/AdminWorkspaces";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        Component: PublicLayout,
        children: [
          { index: true, Component: Landing },
        ],
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { index: true, Component: Login },
          { path: "login", Component: Login },
          { path: "signup", Component: Signup },
          { path: "verify-email", Component: EmailVerification },
          { path: "reset-password", Component: PasswordReset },
        ],
      },
      {
        path: "admin",
        children: [
          { path: "login", Component: AdminLogin },
          { path: "setup", Component: AdminSetup },
          {
            path: "",
            element: React.createElement(
              AdminProtectedRoute,
              null,
              React.createElement(AdminLayout, null)
            ),
            children: [
              { index: true, Component: AdminDashboard },
              { path: "dashboard", Component: AdminDashboard },
              { path: "workspaces", Component: AdminWorkspaces },
              { path: "users", Component: AdminUsers },
              { path: "bookings", Component: AdminBookings },
            ],
          },
        ],
      },
      {
        path: "portal",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(PortalLayout, null)
        ),
        children: [
          { index: true, Component: Dashboard },
          { path: "dashboard", Component: Dashboard },
          { path: "workspaces", Component: WorkspacesBrowse },
          { path: "workspaces/:id", Component: WorkspaceDetails },
          { path: "book/:id", Component: BookingPage },
          { path: "booking-confirmation/:bookingId", Component: BookingConfirmation },
          { path: "my-bookings", Component: MyBookings },
          { path: "profile", Component: UserProfile },
	  { path: "security", Component: SecurityDashboard },

        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);

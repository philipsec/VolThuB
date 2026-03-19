import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('volthub_admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

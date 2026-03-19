import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0052FF] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <p className="text-[#9CA3AF]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

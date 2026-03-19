import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";

export default function AuthLayout() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.loading ?? true;
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/portal/");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071022] to-[#071a2a] flex items-center justify-center p-4 relative">
      {/* Skip to main content link */}
      <a
        href="#auth-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[#0052FF] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to authentication content
      </a>

      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#071022] rounded"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "Light" : "Dark"} mode
        </Button>
      </div>
      <main id="auth-content">
        <Outlet />
      </main>
    </div>
  );
}
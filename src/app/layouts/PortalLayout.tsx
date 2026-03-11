import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Search, Calendar, User, Settings, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/workspaces", icon: Search, label: "Explore Workspaces" },
    { path: "/my-bookings", icon: Calendar, label: "My Bookings" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    await signout();
    navigate("/auth/login");
  };

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0052FF] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <p className="text-[#9CA3AF]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const firstName = user.user_metadata?.firstName || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#071022] text-white flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0052FF] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-bold">VoltHub</span>
          </Link>
        </div>

        {/* User Avatar */}
        <div className="px-6 py-4 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0052FF] flex items-center justify-center">
              <span className="text-lg font-bold">{firstName[0].toUpperCase()}</span>
            </div>
            <div>
              <div className="font-medium">Welcome, {firstName}</div>
              <div className="text-sm text-[#9CA3AF]">Premium Member</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? "bg-[#0052FF] text-white"
                    : "text-[#9CA3AF] hover:bg-[#374151] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-[#374151]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#9CA3AF] hover:bg-[#374151] hover:text-white transition-colors rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[280px] flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
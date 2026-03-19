import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Building2, Users, Calendar, LogOut, Shield, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [adminProfile, setAdminProfile] = useState<any>({ name: 'Admin', firstName: 'Admin', lastName: 'User' });

  useEffect(() => {
    // Check for admin token
    const token = localStorage.getItem('volthub_admin_token');
    const profile = localStorage.getItem('volthub_admin_profile');
    
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (profile) {
      try {
        setAdminProfile(JSON.parse(profile));
      } catch (error) {
        console.error('Error parsing admin profile:', error);
        localStorage.removeItem('volthub_admin_profile');
      }
    }
  }, [navigate]);

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/workspaces", icon: Building2, label: "Workspaces" },
    { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { path: "/admin/users", icon: Users, label: "Users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('volthub_admin_token');
    localStorage.removeItem('volthub_admin_profile');
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#071022] text-white flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-[#374151]">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#EF4444] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">VoltHub</span>
              <div className="text-xs text-[#EF4444]">Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center">
              <span className="text-lg font-bold">{adminProfile?.firstName?.[0] || 'A'}</span>
            </div>
            <div>
              <div className="font-medium">{adminProfile?.name || 'Admin'}</div>
              <div className="text-sm text-[#9CA3AF]">Administrator</div>
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
                    ? "bg-[#EF4444] text-white"
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

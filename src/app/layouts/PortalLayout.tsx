import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Search, Calendar, User, Settings, LogOut, Menu, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import Footer from "../components/Footer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export default function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('volthub_theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      window.localStorage.setItem('volthub_theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('volthub_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const menuItems = [
    { path: "/portal/dashboard", icon: Home, label: "Dashboard" },
    { path: "/portal/workspaces", icon: Search, label: "Explore Workspaces" },
    { path: "/portal/my-bookings", icon: Calendar, label: "My Bookings" },
    { path: "/portal/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = async () => {
    await signout();
    navigate("/");
  };

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0052FF] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">V</span>
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

  const firstName = user.user_metadata?.firstName || user.firstName || 'User';

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#071022] text-white shadow-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Logo */}
          <Link to="/portal/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0052FF] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-bold">VoltHub</span>
          </Link>

          {/* Right-aligned Menu and User Info */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-[#9CA3AF] hover:bg-[#374151] hover:text-white">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-[#071022] border-[#374151]">
                <SheetHeader>
                  <SheetTitle className="text-white text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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
              </SheetContent>
            </Sheet>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0052FF] text-white"
                        : "text-[#9CA3AF] hover:bg-[#374151] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-[#9CA3AF] hover:bg-[#374151] hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Avatar and Info */}
              <div className="flex items-center gap-3">
                {user.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
                    <span className="text-sm font-bold">{firstName[0].toUpperCase()}</span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">Welcome, {firstName}</div>
                  <div className="text-xs text-[#9CA3AF]">Premium Member</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-[#9CA3AF] hover:bg-[#374151] hover:text-white transition-colors rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 sm:px-6 pb-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
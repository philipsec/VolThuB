import { Link } from "react-router";
import { Calendar, Clock, Heart, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../lib/supabase";
import { useDataInit } from "../hooks/useDataInit";

export default function Dashboard() {
  const { user } = useAuth();
  const { initialized } = useDataInit();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!initialized || !user) return;

      try {
        const token = localStorage.getItem('volthub_access_token');
        if (token) {
          const [bookingsData, workspacesData] = await Promise.all([
            api.getBookings(token),
            api.getWorkspaces(),
          ]);
          setBookings(bookingsData.bookings || []);
          setWorkspaces(workspacesData.workspaces || []);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialized, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'User';
  const upcomingBookings = bookings.filter(b => b.status === "confirmed");
  const activeBookingsCount = upcomingBookings.length;
  const hoursBookedThisMonth = bookings.reduce((sum, b) => sum + (b.duration || 0), 0);
  const recentlyViewed = workspaces.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0052FF] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <p className="text-[#9CA3AF]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#071022] mb-2">Welcome, {firstName}</h1>
        <p className="text-lg text-[#9CA3AF]">{getGreeting()}! Ready to book your perfect workspace?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9CA3AF]">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#071022]">{activeBookingsCount}</div>
                <p className="text-sm text-[#10B981] mt-1">Upcoming</p>
              </div>
              <Calendar className="w-12 h-12 text-[#0052FF] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9CA3AF]">Hours This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#071022]">{hoursBookedThisMonth}</div>
                <p className="text-sm text-[#00D4FF] mt-1">Total hours</p>
              </div>
              <Clock className="w-12 h-12 text-[#00D4FF] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9CA3AF]">Favorite Spaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#071022]">5</div>
                <p className="text-sm text-[#F59E0B] mt-1">Saved</p>
              </div>
              <Heart className="w-12 h-12 text-[#F59E0B] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9CA3AF]">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#10B981]">Premium</div>
                <p className="text-sm text-[#9CA3AF] mt-1">Member</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-[#10B981] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#071022]">Upcoming Bookings</h2>
          <Link to="/my-bookings">
            <Button variant="outline" className="border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white">
              View All
            </Button>
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <Card key={booking.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <img
                      src={booking.workspaceImage}
                      alt={booking.workspaceName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#071022] mb-1">{booking.workspaceName}</h3>
                      <p className="text-sm text-[#9CA3AF] mb-2">{booking.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-[#374151]">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-[#374151]">
                          <Clock className="w-4 h-4" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0052FF]">${booking.totalPrice}</div>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#10B981] text-white text-xs rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-[#D1D5DB] shadow-sm">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#071022] mb-2">No upcoming bookings</h3>
              <p className="text-[#9CA3AF] mb-6">Start exploring workspaces to make your first booking</p>
              <Link to="/workspaces">
                <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
                  Browse Workspaces
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recently Viewed Spaces */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#071022]">Recently Viewed Spaces</h2>
          <Link to="/workspaces">
            <Button variant="outline" className="border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white">
              Explore All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyViewed.map((workspace) => (
            <Card key={workspace.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#10B981] text-white text-xs rounded-full">
                  Available
                </span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm text-[#F59E0B]">
                    ⭐ {workspace.rating}
                  </div>
                  <span className="text-sm text-[#9CA3AF]">({workspace.reviewCount} reviews)</span>
                </div>
                <h3 className="text-lg font-semibold text-[#071022] mb-2">{workspace.name}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{workspace.location}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#0052FF]">${workspace.pricePerHour}</span>
                    <span className="text-sm text-[#9CA3AF]">/hour</span>
                  </div>
                  <Link to={`/workspaces/${workspace.id}`}>
                    <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/workspaces">
            <Button size="lg" className="bg-[#0052FF] hover:bg-[#0042CC] text-white px-8">
              Browse All Workspaces
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
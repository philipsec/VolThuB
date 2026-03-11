import { useEffect, useState } from "react";
import { Users, Building2, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { api } from "../../lib/supabase";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('volthub_admin_token');
      if (!token) return;

      const data = await api.getAdminStats(token);
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="w-12 h-12 text-[#EF4444] mx-auto mb-4 animate-spin" />
          <p className="text-[#9CA3AF]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#071022] mb-2">Admin Dashboard</h1>
        <p className="text-lg text-[#9CA3AF]">Overview of VoltHub platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#0052FF] to-[#0042CC] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Total Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats?.totalWorkspaces || 0}</div>
                <p className="text-sm text-white/80 mt-1">Active spaces</p>
              </div>
              <Building2 className="w-12 h-12 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-sm text-white/80 mt-1">Registered users</p>
              </div>
              <Users className="w-12 h-12 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-sm text-white/80 mt-1">{stats?.activeBookings || 0} active</p>
              </div>
              <Calendar className="w-12 h-12 text-white/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-[#D1D5DB] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#071022] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#10B981]" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#071022]">
              ${stats?.totalRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-[#9CA3AF] mt-2">All-time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#D1D5DB] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#071022] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0052FF]" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#071022]">
              ${stats?.monthlyRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-[#9CA3AF] mt-2">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="bg-white border-[#D1D5DB] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#071022]">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBookings.slice(0, 5).map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#071022]">{booking.workspaceName}</h4>
                    <p className="text-sm text-[#9CA3AF]">
                      {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-[#0052FF]">${booking.totalPrice}</div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-[#10B981] text-white' :
                      booking.status === 'pending' ? 'bg-[#F59E0B] text-white' :
                      booking.status === 'cancelled' ? 'bg-[#EF4444] text-white' :
                      'bg-[#6B7280] text-white'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#9CA3AF]">
              No recent bookings
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

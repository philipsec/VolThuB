import { useEffect, useState } from "react";
import { Search, Calendar, MapPin, User } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('volthub_admin_token');
      if (!token) return;

      const data = await api.getAllBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const token = localStorage.getItem('volthub_admin_token');
    if (!token) return;

    try {
      await api.updateBookingStatus(token, id, status);
      toast.success('Booking status updated');
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.workspaceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#9CA3AF]">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#071022]">Bookings Management</h1>
        <p className="text-[#9CA3AF] mt-1">Manage all workspace bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-[#D1D5DB]">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#071022]">{stats.total}</div>
            <p className="text-xs text-[#9CA3AF] mt-1">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-white/80 mt-1">Confirmed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-white/80 mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#6B7280] to-[#4B5563] text-white border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-white/80 mt-1">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-white/80 mt-1">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="bg-white border-[#D1D5DB]">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Workspace Image */}
                {booking.workspaceImage && (
                  <img
                    src={booking.workspaceImage}
                    alt={booking.workspaceName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                
                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#071022] mb-1">
                        {booking.workspaceName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {booking.userName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0052FF]">${booking.totalPrice}</div>
                      <div className="text-sm text-[#9CA3AF]">{booking.duration} hours</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[#374151]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div>
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        ID: {booking.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        booking.status === 'confirmed' ? 'bg-[#10B981] text-white' :
                        booking.status === 'pending' ? 'bg-[#F59E0B] text-white' :
                        booking.status === 'cancelled' ? 'bg-[#EF4444] text-white' :
                        'bg-[#6B7280] text-white'
                      }`}>
                        {booking.status}
                      </span>

                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card className="bg-white border-[#D1D5DB]">
          <CardContent className="p-12 text-center">
            <p className="text-[#9CA3AF]">No bookings found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

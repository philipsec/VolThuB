import { useState } from "react";
import { Search, Calendar, Clock, MapPin, MoreVertical } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { bookings } from "../data/workspaces";

export default function MyBookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.workspaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter(b => b.status === "confirmed");
    } else if (activeTab === "past") {
      filtered = filtered.filter(b => b.status === "completed");
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter(b => b.status === "cancelled");
    }

    return filtered;
  };

  const filteredBookings = filterBookings();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-[#10B981] text-white",
      pending: "bg-[#F59E0B] text-white",
      cancelled: "bg-[#EF4444] text-white",
      completed: "bg-[#6B7280] text-white",
    };

    const labels: Record<string, string> = {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      completed: "Completed",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#071022] mb-2">My Bookings</h1>
        <p className="text-lg text-[#9CA3AF]">Manage and view your workspace reservations</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <Input
          placeholder="Search by workspace name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 border-[#D1D5DB] rounded-lg"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#F3F4F6] p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            All
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            Past
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Workspace Image */}
                      <img
                        src={booking.workspaceImage}
                        alt={booking.workspaceName}
                        className="w-32 h-32 rounded-lg object-cover shrink-0"
                      />

                      {/* Booking Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#071022] mb-1">{booking.workspaceName}</h3>
                          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                            <MapPin className="w-4 h-4" />
                            {booking.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-[#374151]">
                            <Calendar className="w-4 h-4 text-[#0052FF]" />
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#374151]">
                            <Clock className="w-4 h-4 text-[#0052FF]" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                          <div className="text-sm text-[#9CA3AF]">
                            {booking.duration} hour{booking.duration !== 1 ? "s" : ""}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#9CA3AF]">Booking ID:</span>
                          <span className="text-xs font-mono text-[#374151]">{booking.id}</span>
                        </div>
                      </div>

                      {/* Price and Status */}
                      <div className="text-right shrink-0 space-y-4">
                        <div>
                          <div className="text-3xl font-bold text-[#0052FF]">${booking.totalPrice}</div>
                          <div className="text-sm text-[#9CA3AF]">Total paid</div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === "confirmed" && (
                            <>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuItem className="text-[#EF4444]">Cancel Booking</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Contact Support</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-[#D1D5DB]">
              <CardContent className="p-16 text-center">
                <Calendar className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#071022] mb-2">No bookings found</h3>
                <p className="text-[#9CA3AF] mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : activeTab === "all"
                    ? "You haven't made any bookings yet"
                    : `You don't have any ${activeTab} bookings`}
                </p>
                {!searchQuery && activeTab === "all" && (
                  <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
                    Browse Workspaces
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white border-[#D1D5DB]">
            <CardContent className="p-6">
              <div className="text-sm text-[#9CA3AF] mb-1">Total Bookings</div>
              <div className="text-3xl font-bold text-[#071022]">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#D1D5DB]">
            <CardContent className="p-6">
              <div className="text-sm text-[#9CA3AF] mb-1">Total Hours Booked</div>
              <div className="text-3xl font-bold text-[#071022]">
                {bookings.reduce((sum, b) => sum + b.duration, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#D1D5DB]">
            <CardContent className="p-6">
              <div className="text-sm text-[#9CA3AF] mb-1">Total Spent</div>
              <div className="text-3xl font-bold text-[#0052FF]">
                ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

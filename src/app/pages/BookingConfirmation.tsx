import { Link, useParams } from "react-router";
import { CheckCircle2, Calendar, Clock, MapPin, Download, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function BookingConfirmation() {
  const { bookingId } = useParams();

  // Mock booking data (in real app, would fetch based on bookingId)
  const booking = {
    id: bookingId || "VOL-2026-12345",
    workspaceName: "Downtown Creative Hub",
    workspaceImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    location: "123 Main St, San Francisco, CA",
    date: "March 10, 2026",
    time: "09:00 - 17:00",
    duration: "8 hours",
    totalPrice: 216.00,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="min-h-[600px] flex items-center justify-center">
        <Card className="bg-white border-[#D1D5DB] shadow-lg w-full">
          <CardContent className="p-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#071022] mb-2">Booking Confirmed!</h1>
              <p className="text-lg text-[#9CA3AF]">
                Confirmation Number: <span className="font-semibold text-[#374151]">{booking.id}</span>
              </p>
            </div>

            {/* Booking Details Card */}
            <Card className="bg-[#F3F4F6] border-none mb-8">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <img
                    src={booking.workspaceImage}
                    alt={booking.workspaceName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#071022] mb-2">{booking.workspaceName}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <MapPin className="w-4 h-4" />
                      {booking.location}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#0052FF]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#9CA3AF]">Date</div>
                      <div className="font-medium text-[#374151]">{booking.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#0052FF]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#9CA3AF]">Time</div>
                      <div className="font-medium text-[#374151]">{booking.time}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#D1D5DB]">
                  <span className="text-[#9CA3AF]">Total Paid</span>
                  <span className="text-2xl font-bold text-[#10B981]">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant="outline"
                className="h-12 border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Calendar
              </Button>
              <Button
                variant="outline"
                className="h-12 border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </Button>
            </div>

            {/* What's Next Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#071022] mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-[#374151]">Arrive 10 minutes early</div>
                    <div className="text-sm text-[#9CA3AF]">Give yourself time to check in and get settled</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-[#374151]">Check workspace amenities on arrival</div>
                    <div className="text-sm text-[#9CA3AF]">Make sure you have everything you need</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-[#374151]">Contact support if needed</div>
                    <div className="text-sm text-[#9CA3AF]">We're here to help with any questions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Link to="/my-bookings" className="flex-1">
                <Button variant="outline" className="w-full h-12 border-[#D1D5DB] text-[#374151]">
                  View My Bookings
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full h-12 bg-[#0052FF] hover:bg-[#0042CC] text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-center mt-6">
              <Link to="/workspaces" className="text-sm text-[#0052FF] hover:underline">
                Browse More Spaces →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

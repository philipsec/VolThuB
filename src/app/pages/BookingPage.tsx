import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { format } from "date-fns";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Workspace {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
}

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!id) return;
      try {
        const result = await api.getWorkspace(id);
        setWorkspace(result as Workspace);
      } catch (err: any) {
        setError(err.message || "Workspace not found");
      } finally {
        setLoadingWorkspace(false);
      }
    };
    loadWorkspace();
  }, [id]);

  if (loadingWorkspace) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0052FF] mb-4" />
        <p className="text-[#9CA3AF]">Loading workspace...</p>
      </div>
    );
  }

  if (!workspace || error) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-[#071022] mb-4">Workspace not found</h1>
        <Link to="/portal/workspaces">
          <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    return Math.max(0, endHour - startHour);
  };

  const duration = calculateDuration();
  const subtotal = duration * workspace.price;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert("Please agree to the cancellation policy");
      return;
    }

    if (!session?.access_token) {
      alert("Please sign in to complete your booking");
      navigate("/auth/login");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format dates as ISO strings for API
      const dateString = format(date, "yyyy-MM-dd");
      const startDateTime = `${dateString}T${startTime}:00`;
      const endDateTime = `${dateString}T${endTime}:00`;

      const booking = await api.createBooking(
        session.access_token,
        workspace.id,
        startDateTime,
        endDateTime
      );

      // Navigate to confirmation with booking details
      navigate(`/portal/booking-confirmation/${booking.id}`, {
        state: { booking }
      });
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      alert(err.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-4 md:space-y-6">
      {/* Back Button */}
      <Link to={`/portal/workspaces/${id}`}>
        <Button variant="ghost" className="text-[#0052FF] hover:bg-[#F3F4F6] -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workspace
        </Button>
      </Link>

      {/* Breadcrumb */}
      <div className="text-sm text-[#9CA3AF] flex items-center gap-2">
        <Link to="/portal/workspaces" className="text-[#0052FF] hover:underline">Workspaces</Link>
        <span>/</span>
        <Link to={`/portal/workspaces/${id}`} className="text-[#0052FF] hover:underline">{workspace.name}</Link>
        <span>/</span>
        <span className="text-[#374151]">Book</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-[#071022]">Complete Your Booking</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="bg-white border-[#D1D5DB]">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Date Picker */}
              <div>
                <Label htmlFor="date" className="text-[#374151] mb-2 block">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-11 border-[#D1D5DB] rounded-lg"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-[#374151] mb-2 block">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="h-11 border-[#D1D5DB] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <SelectValue placeholder="Select time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endTime" className="text-[#374151] mb-2 block">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="h-11 border-[#D1D5DB] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <SelectValue placeholder="Select time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {duration > 0 && (
                <div className="text-sm text-[#9CA3AF]">
                  Duration: {duration} hour{duration !== 1 ? "s" : ""}
                </div>
              )}

              {/* Special Requirements */}
              <div>
                <Label htmlFor="requirements" className="text-[#374151] mb-2 block">
                  Special Requirements (Optional)
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="Any special requests or requirements..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="min-h-[100px] border-[#D1D5DB] rounded-lg"
                />
              </div>

              {/* Promo Code */}
              <div>
                <Label htmlFor="promo" className="text-[#374151] mb-2 block">Promo Code (Optional)</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="promo"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-11 border-[#D1D5DB] rounded-lg"
                  />
                  <Button type="button" variant="outline" className="border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white h-11">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-[#374151] cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-[#0052FF] hover:underline">
                    cancellation policy
                  </a>
                  {" "}and understand that cancellations must be made 24 hours in advance
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/portal/workspaces/${id}`} className="flex-1">
              <Button type="button" variant="outline" className="w-full h-12 border-[#D1D5DB] text-[#374151]">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!date || !startTime || !endTime || duration === 0 || loading}
              className="flex-1 h-12 bg-[#0052FF] hover:bg-[#0042CC] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-[#D1D5DB] lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Workspace Info */}
              <div>
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  className="w-full h-32 md:h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-[#071022] mb-1">{workspace.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <MapPin className="w-4 h-4" />
                  {workspace.location}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 pt-4 border-t border-[#D1D5DB]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Date:</span>
                  <span className="font-medium text-[#374151]">
                    {date ? format(date, "PP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Time:</span>
                  <span className="font-medium text-[#374151]">
                    {startTime && endTime ? `${startTime} - ${endTime}` : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Duration:</span>
                  <span className="font-medium text-[#374151]">
                    {duration} hour{duration !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#D1D5DB]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">
                    ${workspace.price}/hr × {duration} hr{duration !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-[#374151]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Tax (8%)</span>
                  <span className="font-medium text-[#374151]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-[#D1D5DB]">
                  <span className="text-[#071022]">Total</span>
                  <span className="text-[#0052FF]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Message */}
              <div className="text-xs text-center text-[#9CA3AF] pt-4 border-t border-[#D1D5DB]">
                <p>🔒 Your workspace is being held for 10 minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

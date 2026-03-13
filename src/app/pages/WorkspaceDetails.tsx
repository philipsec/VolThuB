import { useState } from "react";
import { Link, useParams } from "react-router";
import { MapPin, Star, Users, ArrowLeft, Wifi, Coffee, Car, Phone, Monitor, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { workspaces } from "../data/workspaces";

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  "Coffee Bar": Coffee,
  Parking: Car,
  "Phone Booths": Phone,
  "Standing Desks": Monitor,
  "Meeting Rooms": Users,
  Printer: Printer,
  "TV Display": Monitor,
  Whiteboard: Monitor,
};

export default function WorkspaceDetails() {
  const { id } = useParams();
  const workspace = workspaces.find(w => w.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!workspace) {
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

  const similarWorkspaces = workspaces.filter(w => w.id !== id && w.type === workspace.type).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-8">
      {/* Back Button */}
      <Link to="/portal/workspaces">
        <Button variant="ghost" className="text-[#0052FF] hover:bg-[#F3F4F6] -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>
      </Link>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <img
            src={workspace.images[selectedImage]}
            alt={workspace.name}
            className="w-full h-64 md:h-[500px] object-cover rounded-xl"
          />
        </div>
        <div className="hidden md:flex md:flex-col gap-4">
          {workspace.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-[120px] rounded-lg overflow-hidden ${
                selectedImage === index ? "ring-2 ring-[#0052FF]" : ""
              }`}
            >
              <img
                src={image}
                alt={`${workspace.name} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Image Thumbnails */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {workspace.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                selectedImage === index ? "ring-2 ring-[#0052FF]" : ""
              }`}
            >
              <img
                src={image}
                alt={`${workspace.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#071022]">{workspace.name}</h1>
              <span className={`px-3 py-2 md:px-4 text-white text-sm rounded-full self-start sm:self-auto ${
                workspace.availability === "available" ? "bg-[#10B981]" :
                workspace.availability === "limited" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
              }`}>
                {workspace.availability === "available" ? "Available" :
                 workspace.availability === "limited" ? "Limited Availability" : "Unavailable"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-[#F59E0B]">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">{workspace.rating}</span>
              </div>
              <span className="text-[#9CA3AF]">({workspace.reviewCount} reviews)</span>
              <div className="flex items-center gap-2 text-[#374151]">
                <MapPin className="w-5 h-5" />
                {workspace.location}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-2 md:px-4 bg-[#F3F4F6] text-[#374151] rounded-lg">
                <Users className="w-4 h-4" />
                Capacity: {workspace.capacity} people
              </span>
              <span className="px-3 py-2 md:px-4 bg-[#F3F4F6] text-[#374151] rounded-lg capitalize">
                {workspace.type.replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-4">About this workspace</h2>
            <p className="text-[#374151] leading-relaxed">{workspace.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-4 md:mb-6">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {workspace.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div key={amenity} className="flex items-center gap-3 p-3 md:p-4 bg-[#F3F4F6] rounded-lg">
                    <Icon className="w-5 h-5 text-[#0052FF]" />
                    <span className="text-[#374151]">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Map Embed */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-4">Location</h2>
            <div className="w-full h-48 md:h-[300px] rounded-xl overflow-hidden border border-[#D1D5DB]">
              <iframe
                title="Workspace location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(workspace.location)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-sm text-[#9CA3AF]">{workspace.location}</p>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-4 md:mb-6">Reviews</h2>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Excellent workspace! Very professional and well-maintained." },
                { name: "Michael Chen", rating: 5, date: "1 week ago", comment: "Great location and amenities. Perfect for my team meetings." },
                { name: "Emily Rodriguez", rating: 4, date: "2 weeks ago", comment: "Good workspace overall. Coffee could be better." },
              ].map((review, index) => (
                <Card key={index} className="bg-white border-[#D1D5DB]">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0052FF] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="font-semibold text-[#071022]">{review.name}</div>
                            <div className="text-sm text-[#9CA3AF]">{review.date}</div>
                          </div>
                          <div className="flex items-center gap-1 text-[#F59E0B]">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#374151] mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-[#D1D5DB] lg:sticky lg:top-8">
            <CardContent className="p-4 md:p-6">
              <div className="mb-6">
                <div className="text-3xl md:text-4xl font-bold text-[#0052FF] mb-1">
                  ${workspace.pricePerHour}
                  <span className="text-base md:text-lg text-[#9CA3AF] font-normal">/hour</span>
                </div>
                <p className="text-sm text-[#9CA3AF]">Plus applicable taxes</p>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6">
                <div className="p-3 md:p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Workspace Type</div>
                  <div className="font-semibold text-[#071022] capitalize">{workspace.type.replace("-", " ")}</div>
                </div>

                <div className="p-3 md:p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Capacity</div>
                  <div className="font-semibold text-[#071022]">{workspace.capacity} people</div>
                </div>

                <div className="p-3 md:p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Minimum Booking</div>
                  <div className="font-semibold text-[#071022]">1 hour</div>
                </div>
              </div>

              <Link to={`/portal/book/${workspace.id}`}>
                <Button className="w-full h-12 bg-[#0052FF] hover:bg-[#0042CC] text-white text-base md:text-lg">
                  Book This Space
                </Button>
              </Link>

              <p className="text-xs text-center text-[#9CA3AF] mt-4">
                Free cancellation up to 24 hours before booking
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Workspaces */}
      {similarWorkspaces.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#071022] mb-4 md:mb-6">Similar Workspaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {similarWorkspaces.map((similar) => (
              <Card key={similar.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={similar.image}
                    alt={similar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-1 text-sm text-[#F59E0B] mb-2">
                    ⭐ {similar.rating}
                  </div>
                  <h3 className="text-lg font-semibold text-[#071022] mb-2">{similar.name}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-4">{similar.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#0052FF]">${similar.pricePerHour}</span>
                      <span className="text-sm text-[#9CA3AF]">/hr</span>
                    </div>
                    <Link to={`/portal/workspaces/${similar.id}`}>
                      <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

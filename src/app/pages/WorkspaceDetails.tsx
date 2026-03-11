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
        <Link to="/workspaces">
          <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const similarWorkspaces = workspaces.filter(w => w.id !== id && w.type === workspace.type).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to="/workspaces">
        <Button variant="ghost" className="text-[#0052FF] hover:bg-[#F3F4F6]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>
      </Link>

      {/* Image Gallery */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <img
            src={workspace.images[selectedImage]}
            alt={workspace.name}
            className="w-full h-[500px] object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-4">
          {workspace.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-[160px] rounded-lg overflow-hidden ${
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

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-[#071022]">{workspace.name}</h1>
              <span className={`px-4 py-2 text-white text-sm rounded-full ${
                workspace.availability === "available" ? "bg-[#10B981]" :
                workspace.availability === "limited" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
              }`}>
                {workspace.availability === "available" ? "Available" :
                 workspace.availability === "limited" ? "Limited Availability" : "Unavailable"}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
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

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg">
                <Users className="w-4 h-4" />
                Capacity: {workspace.capacity} people
              </span>
              <span className="px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg capitalize">
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
            <h2 className="text-2xl font-bold text-[#071022] mb-6">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {workspace.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div key={amenity} className="flex items-center gap-3 p-4 bg-[#F3F4F6] rounded-lg">
                    <Icon className="w-5 h-5 text-[#0052FF]" />
                    <span className="text-[#374151]">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-4">Location</h2>
            <div className="w-full h-[300px] bg-[#F3F4F6] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#9CA3AF] mx-auto mb-2" />
                <p className="text-[#9CA3AF]">{workspace.location}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#071022] mb-6">Reviews</h2>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Excellent workspace! Very professional and well-maintained." },
                { name: "Michael Chen", rating: 5, date: "1 week ago", comment: "Great location and amenities. Perfect for my team meetings." },
                { name: "Emily Rodriguez", rating: 4, date: "2 weeks ago", comment: "Good workspace overall. Coffee could be better." },
              ].map((review, index) => (
                <Card key={index} className="bg-white border-[#D1D5DB]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0052FF] rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#071022]">{review.name}</div>
                          <div className="text-sm text-[#9CA3AF]">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#374151]">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="col-span-1">
          <Card className="bg-white border-[#D1D5DB] sticky top-8">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-[#0052FF] mb-1">
                  ${workspace.pricePerHour}
                  <span className="text-lg text-[#9CA3AF] font-normal">/hour</span>
                </div>
                <p className="text-sm text-[#9CA3AF]">Plus applicable taxes</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Workspace Type</div>
                  <div className="font-semibold text-[#071022] capitalize">{workspace.type.replace("-", " ")}</div>
                </div>

                <div className="p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Capacity</div>
                  <div className="font-semibold text-[#071022]">{workspace.capacity} people</div>
                </div>

                <div className="p-4 bg-[#F3F4F6] rounded-lg">
                  <div className="text-sm text-[#9CA3AF] mb-1">Minimum Booking</div>
                  <div className="font-semibold text-[#071022]">1 hour</div>
                </div>
              </div>

              <Link to={`/book/${workspace.id}`}>
                <Button className="w-full h-12 bg-[#0052FF] hover:bg-[#0042CC] text-white text-lg">
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
          <h2 className="text-2xl font-bold text-[#071022] mb-6">Similar Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarWorkspaces.map((similar) => (
              <Card key={similar.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={similar.image}
                    alt={similar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-sm text-[#F59E0B] mb-2">
                    ⭐ {similar.rating}
                  </div>
                  <h3 className="text-lg font-semibold text-[#071022] mb-2">{similar.name}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-4">{similar.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-[#0052FF]">${similar.pricePerHour}</span>
                      <span className="text-sm text-[#9CA3AF]">/hr</span>
                    </div>
                    <Link to={`/workspaces/${similar.id}`}>
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

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, MapPin, Users } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../lib/api";
import { useDataInit } from "../hooks/useDataInit";

interface Workspace {
  id: string;
  name: string;
  location: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  amenities: string[];
  type: "open" | "private" | "meeting-room";
  availability: "available" | "limited" | "unavailable";
}

export default function WorkspacesBrowse() {
  const { initialized } = useDataInit();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadWorkspaces() {
      if (!initialized) return;

      try {
        const { workspaces: data } = await api.getWorkspaces();
        setWorkspaces(data || []);
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [initialized]);

  const amenitiesList = ["WiFi", "Meeting Rooms", "Parking", "Coffee Bar", "Phone Booths", "Standing Desks"];
  const capacityOptions = [
    { label: "2-4 people", value: "2-4" },
    { label: "4-8 people", value: "4-8" },
    { label: "8+ people", value: "8+" },
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleCapacity = (capacity: string) => {
    setSelectedCapacity(prev =>
      prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
    );
  };

  const filterWorkspaces = (workspaces: Workspace[]) => {
    return workspaces.filter(workspace => {
      // Search filter
      const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = workspace.pricePerHour >= priceRange[0] && workspace.pricePerHour <= priceRange[1];

      // Amenities filter
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(amenity => workspace.amenities.includes(amenity));

      // Capacity filter
      const matchesCapacity = selectedCapacity.length === 0 || selectedCapacity.some(cap => {
        if (cap === "2-4") return workspace.capacity >= 2 && workspace.capacity <= 4;
        if (cap === "4-8") return workspace.capacity > 4 && workspace.capacity <= 8;
        if (cap === "8+") return workspace.capacity > 8;
        return false;
      });

      return matchesSearch && matchesPrice && matchesAmenities && matchesCapacity;
    });
  };

  const sortWorkspaces = (workspaces: Workspace[]) => {
    const sorted = [...workspaces];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  };

  const filteredWorkspaces = sortWorkspaces(filterWorkspaces(workspaces));

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100]);
    setSelectedAmenities([]);
    setSelectedCapacity([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071022] mb-2">Explore Workspaces</h1>
        <p className="text-base md:text-lg text-[#9CA3AF]">Find the perfect workspace for your needs</p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <Input
            placeholder="Search by location or workspace name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-[#D1D5DB] rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white h-12 px-4"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 border-[#D1D5DB] rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Lowest Price</SelectItem>
              <SelectItem value="price-high">Highest Price</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <aside className={`w-full lg:w-[280px] lg:shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <Card className="bg-white border-[#D1D5DB] lg:sticky lg:top-8">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#071022] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-[#0052FF] hover:text-[#0042CC] text-sm"
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-[#374151] mb-3 block">Price Range (per hour)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-3"
                />
                <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <Label className="text-[#374151] mb-3 block">Capacity</Label>
                <div className="space-y-3">
                  {capacityOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`capacity-${option.value}`}
                        checked={selectedCapacity.includes(option.value)}
                        onCheckedChange={() => toggleCapacity(option.value)}
                      />
                      <label
                        htmlFor={`capacity-${option.value}`}
                        className="text-sm text-[#374151] cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <Label className="text-[#374151] mb-3 block">Amenities</Label>
                <div className="space-y-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm text-[#374151] cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Workspace Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-[#9CA3AF]">
            Showing {filteredWorkspaces.length} of {workspaces.length} workspaces
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredWorkspaces.map((workspace) => (
              <Card key={workspace.id} className="bg-white border-[#D1D5DB] shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={workspace.image}
                    alt={workspace.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 text-white text-xs rounded-full ${
                    workspace.availability === "available" ? "bg-[#10B981]" :
                    workspace.availability === "limited" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                  }`}>
                    {workspace.availability === "available" ? "Available" :
                     workspace.availability === "limited" ? "Limited" : "Unavailable"}
                  </span>
                </div>

                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-sm text-[#F59E0B]">
                      ⭐ {workspace.rating}
                    </div>
                    <span className="text-sm text-[#9CA3AF]">({workspace.reviewCount} reviews)</span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#071022] mb-2">{workspace.name}</h3>

                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-3">
                    <MapPin className="w-4 h-4" />
                    {workspace.location}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 md:px-3 bg-[#F3F4F6] text-[#374151] text-xs rounded-full">
                      <Users className="w-3 h-3" />
                      Seats: {workspace.capacity}
                    </span>
                    <span className="px-2 py-1 md:px-3 bg-[#F3F4F6] text-[#374151] text-xs rounded-full">
                      {workspace.type.replace("-", " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {workspace.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="text-xs text-[#9CA3AF]">
                        • {amenity}
                      </span>
                    ))}
                    {workspace.amenities.length > 3 && (
                      <span className="text-xs text-[#9CA3AF]">
                        +{workspace.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-[#D1D5DB] gap-3">
                    <div>
                      <span className="text-2xl font-bold text-[#0052FF]">${workspace.pricePerHour}</span>
                      <span className="text-sm text-[#9CA3AF]">/hour</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/portal/workspaces/${workspace.id}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white">
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/portal/book/${workspace.id}`} className="w-full sm:w-auto">
                        <Button className="w-full bg-[#0052FF] hover:bg-[#0042CC] text-white">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWorkspaces.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#071022] mb-2">No workspaces found</h3>
              <p className="text-[#9CA3AF] mb-6">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters} className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
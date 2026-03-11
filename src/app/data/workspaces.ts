export interface Workspace {
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

export const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Downtown Creative Hub",
    location: "123 Main St, San Francisco, CA",
    description: "Modern coworking space in the heart of downtown with stunning city views. Perfect for creative professionals and startups.",
    capacity: 12,
    pricePerHour: 25,
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Coffee Bar", "Meeting Rooms", "Parking", "Standing Desks"],
    type: "open",
    availability: "available",
  },
  {
    id: "2",
    name: "Tech Innovation Center",
    location: "456 Tech Blvd, Palo Alto, CA",
    description: "State-of-the-art workspace designed for tech startups and innovators. Features cutting-edge technology and collaboration spaces.",
    capacity: 8,
    pricePerHour: 35,
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Meeting Rooms", "Parking", "Phone Booths", "Whiteboard", "TV Display"],
    type: "private",
    availability: "available",
  },
  {
    id: "3",
    name: "Artistic Loft Space",
    location: "789 Creative Ave, Brooklyn, NY",
    description: "Inspiring loft space with high ceilings and natural light. Ideal for creative professionals and small teams.",
    capacity: 6,
    pricePerHour: 30,
    rating: 4.7,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Coffee Bar", "Standing Desks", "Printer"],
    type: "open",
    availability: "limited",
  },
  {
    id: "4",
    name: "Executive Boardroom",
    location: "321 Business Park, Boston, MA",
    description: "Professional boardroom perfect for executive meetings and presentations. Equipped with premium AV technology.",
    capacity: 16,
    pricePerHour: 50,
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Conference Call", "TV Display", "Whiteboard", "Coffee Bar"],
    type: "meeting-room",
    availability: "available",
  },
  {
    id: "5",
    name: "Startup Garage",
    location: "555 Entrepreneur Way, Austin, TX",
    description: "Collaborative workspace designed for early-stage startups. Flexible layout with multiple work zones.",
    capacity: 10,
    pricePerHour: 28,
    rating: 4.6,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Meeting Rooms", "Coffee Bar", "Parking", "Phone Booths"],
    type: "open",
    availability: "available",
  },
  {
    id: "6",
    name: "Quiet Focus Suite",
    location: "888 Serenity Lane, Seattle, WA",
    description: "Private, soundproofed workspace ideal for focused work and concentration. Perfect for individual professionals.",
    capacity: 4,
    pricePerHour: 40,
    rating: 4.8,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Phone Booths", "Standing Desks", "Coffee Bar"],
    type: "private",
    availability: "available",
  },
];

export interface Booking {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceImage: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

export const bookings: Booking[] = [
  {
    id: "VOL-2024-001",
    workspaceId: "1",
    workspaceName: "Downtown Creative Hub",
    workspaceImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    location: "123 Main St, San Francisco, CA",
    date: "2026-03-10",
    startTime: "09:00",
    endTime: "17:00",
    duration: 8,
    totalPrice: 200,
    status: "confirmed",
  },
  {
    id: "VOL-2024-002",
    workspaceId: "2",
    workspaceName: "Tech Innovation Center",
    workspaceImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop",
    location: "456 Tech Blvd, Palo Alto, CA",
    date: "2026-03-15",
    startTime: "14:00",
    endTime: "18:00",
    duration: 4,
    totalPrice: 140,
    status: "confirmed",
  },
  {
    id: "VOL-2024-003",
    workspaceId: "4",
    workspaceName: "Executive Boardroom",
    workspaceImage: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400&h=300&fit=crop",
    location: "321 Business Park, Boston, MA",
    date: "2026-02-28",
    startTime: "10:00",
    endTime: "12:00",
    duration: 2,
    totalPrice: 100,
    status: "completed",
  },
];

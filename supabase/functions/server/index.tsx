import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b17352a1/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTHENTICATION ROUTES ============

// Sign up
app.post("/make-server-b17352a1/auth/signup", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();
    
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName, 
        lastName,
        name: `${firstName} ${lastName}` 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: '',
      company: '',
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Sign in
app.post("/make-server-b17352a1/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get session
app.get("/make-server-b17352a1/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ session: null, user: null });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ session: null, user: null });
    }

    return c.json({ 
      user,
      session: { access_token: accessToken }
    });
  } catch (error) {
    console.error("Get session error:", error);
    return c.json({ session: null, user: null });
  }
});

// Password reset request
app.post("/make-server-b17352a1/auth/reset-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Password reset error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    return c.json({ error: "Failed to send password reset email" }, 500);
  }
});

// Sign out
app.post("/make-server-b17352a1/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No token provided" }, 401);
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
    return c.json({ error: "Failed to sign out" }, 500);
  }
});

// ============ WORKSPACE ROUTES ============

// Get all workspaces
app.get("/make-server-b17352a1/workspaces", async (c) => {
  try {
    const workspaces = await kv.getByPrefix("workspace:");
    
    // Apply filters from query params
    const type = c.req.query('type');
    const availability = c.req.query('availability');
    const search = c.req.query('search')?.toLowerCase();
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');

    let filtered = workspaces;

    if (type && type !== 'all') {
      filtered = filtered.filter(w => w.type === type);
    }
    if (availability && availability !== 'all') {
      filtered = filtered.filter(w => w.availability === availability);
    }
    if (search) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(search) ||
        w.location.toLowerCase().includes(search) ||
        w.description.toLowerCase().includes(search)
      );
    }
    if (minPrice) {
      filtered = filtered.filter(w => w.pricePerHour >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(w => w.pricePerHour <= parseFloat(maxPrice));
    }

    return c.json({ workspaces: filtered });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return c.json({ error: "Failed to fetch workspaces" }, 500);
  }
});

// Get workspace by ID
app.get("/make-server-b17352a1/workspaces/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const workspace = await kv.get(`workspace:${id}`);

    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    return c.json({ workspace });
  } catch (error) {
    console.error("Get workspace error:", error);
    return c.json({ error: "Failed to fetch workspace" }, 500);
  }
});

// ============ BOOKING ROUTES ============

// Create booking
app.post("/make-server-b17352a1/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = `VOL-${Date.now()}`;
    
    const booking = {
      id: bookingId,
      userId: user.id,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);
    
    // Also add to user's bookings list
    const userBookings = await kv.get(`user-bookings:${user.id}`) || [];
    userBookings.push(bookingId);
    await kv.set(`user-bookings:${user.id}`, userBookings);

    return c.json({ booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return c.json({ error: "Failed to create booking" }, 500);
  }
});

// Get user bookings
app.get("/make-server-b17352a1/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userBookingIds = await kv.get(`user-bookings:${user.id}`) || [];
    const bookings = await Promise.all(
      userBookingIds.map((id: string) => kv.get(`booking:${id}`))
    );

    // Filter out any null values
    const validBookings = bookings.filter(b => b !== null);

    return c.json({ bookings: validBookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Get booking by ID
app.get("/make-server-b17352a1/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const booking = await kv.get(`booking:${id}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Verify booking belongs to user
    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    return c.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return c.json({ error: "Failed to fetch booking" }, 500);
  }
});

// Cancel booking
app.delete("/make-server-b17352a1/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const booking = await kv.get(`booking:${id}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Verify booking belongs to user
    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await kv.set(`booking:${id}`, booking);

    return c.json({ booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return c.json({ error: "Failed to cancel booking" }, 500);
  }
});

// ============ USER PROFILE ROUTES ============

// Get user profile
app.get("/make-server-b17352a1/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);

    if (!profile) {
      // Create profile from user metadata
      const newProfile = {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        name: user.user_metadata?.name || '',
        phone: '',
        company: '',
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${user.id}`, newProfile);
      return c.json({ profile: newProfile });
    }

    return c.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-b17352a1/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`) || {};

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id,
      email: user.email, // Don't allow email updates
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ============ SEED DATA (for initial setup) ============

app.post("/make-server-b17352a1/seed-data", async (c) => {
  try {
    // Check if data already exists
    const existing = await kv.getByPrefix("workspace:");
    if (existing.length > 0) {
      return c.json({ message: "Data already seeded" });
    }

    const workspaces = [
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

    // Store workspaces
    for (const workspace of workspaces) {
      await kv.set(`workspace:${workspace.id}`, workspace);
    }

    return c.json({ message: "Data seeded successfully", count: workspaces.length });
  } catch (error) {
    console.error("Seed data error:", error);
    return c.json({ error: "Failed to seed data" }, 500);
  }
});

// ============ ADMIN ROUTES ============

// Middleware to check admin role
const checkAdmin = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check if user is admin (stored in user metadata or profile)
  const profile = await kv.get(`user:${user.id}`);
  if (!profile?.isAdmin) {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  await next();
};

// Admin login - same as regular login but checks admin status
app.post("/make-server-b17352a1/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Admin sign in error:", error);
      return c.json({ error: error.message }, 401);
    }

    // Check if user is admin
    const profile = await kv.get(`user:${data.user.id}`);
    if (!profile?.isAdmin) {
      return c.json({ error: "Access denied: Admin privileges required" }, 403);
    }

    return c.json({ 
      session: data.session,
      user: data.user,
      profile 
    });
  } catch (error) {
    console.error("Admin sign in error:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Create admin user (for initial setup)
app.post("/make-server-b17352a1/admin/create-admin", async (c) => {
  try {
    const { email, password, firstName, lastName, secretKey } = await c.req.json();
    
    // Simple secret key check for admin creation
    if (secretKey !== "volthub-admin-2024") {
      return c.json({ error: "Invalid secret key" }, 403);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName, 
        lastName,
        name: `${firstName} ${lastName}`,
        isAdmin: true 
      },
      email_confirm: true
    });

    if (error) {
      console.error("Create admin error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store admin profile
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: '',
      company: '',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user, message: "Admin user created successfully" });
  } catch (error) {
    console.error("Create admin error:", error);
    return c.json({ error: "Failed to create admin user" }, 500);
  }
});

// Admin Dashboard Stats
app.get("/make-server-b17352a1/admin/stats", checkAdmin, async (c) => {
  try {
    const workspaces = await kv.getByPrefix("workspace:");
    const users = await kv.getByPrefix("user:");
    const allBookingIds = await kv.getByPrefix("user-bookings:");
    
    // Get all bookings
    let bookings: any[] = [];
    for (const userBookingList of allBookingIds) {
      if (Array.isArray(userBookingList)) {
        const userBookings = await Promise.all(
          userBookingList.map((id: string) => kv.get(`booking:${id}`))
        );
        bookings.push(...userBookings.filter(b => b !== null));
      }
    }

    // Calculate revenue
    const totalRevenue = bookings.reduce((sum, b) => sum + (b?.totalPrice || 0), 0);
    const monthlyRevenue = bookings
      .filter(b => {
        const bookingDate = new Date(b?.createdAt || b?.date);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, b) => sum + (b?.totalPrice || 0), 0);

    // Active bookings (confirmed status)
    const activeBookings = bookings.filter(b => b?.status === 'confirmed').length;

    return c.json({
      totalWorkspaces: workspaces.length,
      totalUsers: users.filter(u => !u?.isAdmin).length,
      totalBookings: bookings.length,
      activeBookings,
      totalRevenue,
      monthlyRevenue,
      recentBookings: bookings.slice(-10).reverse(),
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// Admin - Get all users
app.get("/make-server-b17352a1/admin/users", checkAdmin, async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingIds = await kv.get(`user-bookings:${user.id}`) || [];
        return {
          ...user,
          bookingsCount: bookingIds.length,
        };
      })
    );
    
    return c.json({ users: usersWithBookings });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Admin - Get all bookings
app.get("/make-server-b17352a1/admin/bookings", checkAdmin, async (c) => {
  try {
    const allBookingIds = await kv.getByPrefix("user-bookings:");
    
    let bookings: any[] = [];
    for (const userBookingList of allBookingIds) {
      if (Array.isArray(userBookingList)) {
        const userBookings = await Promise.all(
          userBookingList.map((id: string) => kv.get(`booking:${id}`))
        );
        bookings.push(...userBookings.filter(b => b !== null));
      }
    }

    // Get user details for each booking
    const bookingsWithUsers = await Promise.all(
      bookings.map(async (booking) => {
        const user = await kv.get(`user:${booking.userId}`);
        return {
          ...booking,
          userName: user?.name || user?.email || 'Unknown',
          userEmail: user?.email,
        };
      })
    );

    return c.json({ bookings: bookingsWithUsers });
  } catch (error) {
    console.error("Get all bookings error:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Admin - Create workspace
app.post("/make-server-b17352a1/admin/workspaces", checkAdmin, async (c) => {
  try {
    const workspaceData = await c.req.json();
    const workspaceId = `ws-${Date.now()}`;
    
    const workspace = {
      id: workspaceId,
      ...workspaceData,
      rating: workspaceData.rating || 0,
      reviewCount: workspaceData.reviewCount || 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`workspace:${workspaceId}`, workspace);

    return c.json({ workspace, message: "Workspace created successfully" });
  } catch (error) {
    console.error("Create workspace error:", error);
    return c.json({ error: "Failed to create workspace" }, 500);
  }
});

// Admin - Update workspace
app.put("/make-server-b17352a1/admin/workspaces/:id", checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const currentWorkspace = await kv.get(`workspace:${id}`);
    if (!currentWorkspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    const updatedWorkspace = {
      ...currentWorkspace,
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`workspace:${id}`, updatedWorkspace);

    return c.json({ workspace: updatedWorkspace, message: "Workspace updated successfully" });
  } catch (error) {
    console.error("Update workspace error:", error);
    return c.json({ error: "Failed to update workspace" }, 500);
  }
});

// Admin - Delete workspace
app.delete("/make-server-b17352a1/admin/workspaces/:id", checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    
    const workspace = await kv.get(`workspace:${id}`);
    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    await kv.del(`workspace:${id}`);

    return c.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    return c.json({ error: "Failed to delete workspace" }, 500);
  }
});

// Admin - Update booking status
app.put("/make-server-b17352a1/admin/bookings/:id", checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const booking = await kv.get(`booking:${id}`);
    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    
    await kv.set(`booking:${id}`, booking);

    return c.json({ booking, message: "Booking updated successfully" });
  } catch (error) {
    console.error("Update booking error:", error);
    return c.json({ error: "Failed to update booking" }, 500);
  }
});

// Admin - Delete user
app.delete("/make-server-b17352a1/admin/users/:id", checkAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    
    const user = await kv.get(`user:${id}`);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Delete user profile
    await kv.del(`user:${id}`);
    
    // Delete user bookings index
    await kv.del(`user-bookings:${id}`);

    return c.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

Deno.serve(app.fetch);
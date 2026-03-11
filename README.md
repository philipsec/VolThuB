# VoltHub - Premium Coworking Space Booking Platform

> A fully functional, production-ready platform for managing and booking coworking spaces

![VoltHub](https://img.shields.io/badge/VoltHub-Premium_Coworking-0052FF?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-10B981?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Supabase-00D4FF?style=for-the-badge)

---

## 🎯 Overview

VoltHub is a comprehensive coworking space booking platform featuring:
- **User Portal** for browsing and booking workspaces
- **Admin Portal** for complete platform management
- **Real-time Backend** with Supabase integration
- **Professional UI** with premium branding and smooth UX

---

## ✨ Features

### 👥 User Portal
- ✅ **Authentication** - Signup, login, password reset
- ✅ **Browse Workspaces** - Search, filter, sort capabilities
- ✅ **Booking System** - Date/time selection with price calculation
- ✅ **Booking Management** - View, track, and cancel bookings
- ✅ **User Profile** - Manage personal information
- ✅ **Responsive Design** - Works on all devices

### 🛡️ Admin Portal
- ✅ **Analytics Dashboard** - Real-time stats and insights
- ✅ **Workspace CRUD** - Create, edit, delete workspaces
- ✅ **User Management** - View and manage all users
- ✅ **Booking Oversight** - Monitor and update all bookings
- ✅ **Revenue Tracking** - Total and monthly revenue
- ✅ **Role-Based Access** - Secure admin authentication

---

## 🚀 Quick Start

### 1. Create Admin Account
Navigate to: `/admin/setup`

Credentials needed:
- Email, Password, Name
- Secret Key: `volthub-admin-2024`

### 2. Access Admin Portal
Login at: `/admin/login`

Manage:
- Workspaces
- Users
- Bookings
- Analytics

### 3. Test User Flow
1. Signup at `/auth/signup`
2. Browse workspaces at `/workspaces`
3. Make a booking
4. View at `/my-bookings`

**📖 Full Guide:** See [QUICK_START.md](/QUICK_START.md)

---

## 🗂️ Project Structure

```
volthub/
├── src/app/
│   ├── components/          # UI components
│   ├── contexts/            # React contexts (Auth)
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Page layouts
│   │   ├── AuthLayout.tsx   # Auth pages wrapper
│   │   ├── PortalLayout.tsx # User portal wrapper
│   │   └── AdminLayout.tsx  # Admin portal wrapper
│   ├── lib/                 # Utilities
│   │   └── supabase.ts      # API client
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminSetup.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminWorkspaces.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminBookings.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── WorkspacesBrowse.tsx
│   │   ├── MyBookings.tsx
│   │   └── UserProfile.tsx
│   └── routes.ts            # React Router config
│
├── supabase/functions/server/
│   ├── index.tsx            # Hono server with all routes
│   └── kv_store.tsx         # Database utilities
│
└── docs/
    ├── QUICK_START.md
    ├── BACKEND_INTEGRATION_GUIDE.md
    └── ADMIN_PORTAL_GUIDE.md
```

---

## 🔐 Authentication

### User Authentication
- Email/password signup and login
- JWT token-based sessions
- Persistent sessions via localStorage
- Password reset functionality
- Protected user routes

### Admin Authentication
- Separate admin login system
- Role-based access control (isAdmin flag)
- Secret key requirement for admin creation
- Protected admin routes with middleware
- Separate admin token storage

---

## 🎨 Design System

### Colors
- **Primary Blue:** `#0052FF` (User portal)
- **Dark Navy:** `#071022` (Backgrounds, sidebars)
- **Accent Cyan:** `#00D4FF` (Highlights, links)
- **Admin Red:** `#EF4444` (Admin portal)
- **Success Green:** `#10B981`
- **Warning Orange:** `#F59E0B`

### Typography
- **Font Family:** Inter, Segoe UI, system-ui
- **Headings:** Bold weights
- **Body:** Regular weights

### Components
- Radix UI primitives
- Custom styled with Tailwind CSS
- Consistent spacing and shadows
- Smooth transitions and animations

---

## 🗄️ Backend Architecture

### Technology Stack
- **Framework:** Hono (Edge-optimized web framework)
- **Database:** Supabase KV Store
- **Authentication:** Supabase Auth with JWT
- **Runtime:** Deno

### API Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/session` - Get current session
- `POST /auth/signout` - Logout
- `POST /auth/reset-password` - Password reset

#### Workspaces
- `GET /workspaces` - List all workspaces (with filters)
- `GET /workspaces/:id` - Get workspace details

#### Bookings (Protected)
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `DELETE /bookings/:id` - Cancel booking

#### Admin (Protected)
- `POST /admin/login` - Admin login
- `POST /admin/create-admin` - Create admin user
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/bookings` - List all bookings
- `POST /admin/workspaces` - Create workspace
- `PUT /admin/workspaces/:id` - Update workspace
- `DELETE /admin/workspaces/:id` - Delete workspace
- `PUT /admin/bookings/:id` - Update booking status
- `DELETE /admin/users/:id` - Delete user

---

## 📊 Data Models

### Workspace
```typescript
{
  id: string
  name: string
  location: string
  description: string
  capacity: number
  pricePerHour: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  amenities: string[]
  type: "open" | "private" | "meeting-room"
  availability: "available" | "limited" | "unavailable"
}
```

### User
```typescript
{
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  phone: string
  company: string
  isAdmin: boolean
  createdAt: string
}
```

### Booking
```typescript
{
  id: string
  userId: string
  workspaceId: string
  workspaceName: string
  workspaceImage: string
  location: string
  date: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  createdAt: string
}
```

---

## 🔧 Configuration

### Environment Variables
The following are automatically configured by Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Admin Secret Key
Default: `volthub-admin-2024`

**⚠️ IMPORTANT:** Change this in production!

Update in: `/supabase/functions/server/index.tsx`
```typescript
if (secretKey !== "your-new-secret-key") {
  return c.json({ error: "Invalid secret key" }, 403);
}
```

---

## 📱 User Flows

### New User Journey
1. Visit `/auth/signup`
2. Create account
3. Auto-login to dashboard
4. Browse workspaces at `/workspaces`
5. Select workspace and book
6. View booking at `/my-bookings`
7. Manage profile at `/profile`

### Admin Journey
1. Visit `/admin/setup` (first time)
2. Create admin with secret key
3. Login at `/admin/login`
4. View stats at `/admin/dashboard`
5. Add workspaces at `/admin/workspaces`
6. Monitor users at `/admin/users`
7. Manage bookings at `/admin/bookings`

---

## 🧪 Testing

### Test Accounts

**Admin:**
Create at `/admin/setup` with secret key

**Regular User:**
Create at `/auth/signup`

### Test Scenarios
1. ✅ User signup and login
2. ✅ Browse and filter workspaces
3. ✅ Create booking
4. ✅ View booking history
5. ✅ Update profile
6. ✅ Admin login
7. ✅ Create workspace
8. ✅ Edit workspace
9. ✅ Delete workspace
10. ✅ Manage bookings
11. ✅ View analytics

---

## 🚧 Future Enhancements

### Phase 2 Features
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Review and rating system
- [ ] Advanced search with map view
- [ ] Real-time availability calendar
- [ ] Multi-language support

### Phase 3 Features
- [ ] Mobile apps (iOS/Android)
- [ ] In-app messaging
- [ ] Loyalty program
- [ ] Analytics dashboard with charts
- [ ] Export functionality (CSV, PDF)
- [ ] Social media integration

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in minutes
- **[Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)** - API and architecture details
- **[Admin Portal Guide](./ADMIN_PORTAL_GUIDE.md)** - Complete admin documentation

---

## 🤝 Support

### Common Issues

**Can't login to admin panel:**
- Verify account has `isAdmin: true`
- Use `/admin/setup` with correct secret key
- Clear localStorage and retry

**Workspaces not loading:**
- Data seeds automatically on first load
- Check browser console for errors
- Verify Supabase connection

**Booking not saving:**
- Ensure you're logged in
- Check token in localStorage
- Verify workspace exists

---

## 📄 License

This project is proprietary software for VoltHub.

---

## 🎉 Credits

Built with:
- React + TypeScript
- Tailwind CSS v4
- Radix UI
- Supabase
- Hono
- React Router v7
- Lucide Icons

---

## 🔗 Links

- **User Portal:** `/`
- **Admin Portal:** `/admin/login`
- **Admin Setup:** `/admin/setup`
- **Documentation:** `/docs`

---

**VoltHub** - Premium Coworking Made Simple

*Created with ⚡ by Figma Make*

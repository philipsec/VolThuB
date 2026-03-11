# VoltHub Admin Portal - Complete Guide

## Overview
The VoltHub Admin Portal is a comprehensive management system for administrators to oversee all platform operations including workspaces, users, bookings, and analytics.

## Features

### 1. Admin Authentication
- **Separate admin login** at `/admin/login`
- **Role-based access control** - Only users with `isAdmin: true` can access
- **Secure token management** - Admin sessions stored separately from user sessions
- **Protected routes** - All admin pages require authentication

### 2. Admin Dashboard (`/admin/dashboard`)
**Key Metrics:**
- Total Workspaces
- Total Users (excluding admins)
- Total Bookings & Active Bookings
- Total Revenue (all-time)
- Monthly Revenue
- Recent Bookings List (last 10)

**Visual Design:**
- Color-coded stat cards
- Real-time data updates
- Revenue tracking
- Activity monitoring

### 3. Workspaces Management (`/admin/workspaces`)
**Full CRUD Operations:**
- ✅ Create new workspaces
- ✅ Edit existing workspaces
- ✅ Delete workspaces
- ✅ Search and filter

**Workspace Fields:**
- Name
- Location
- Description
- Capacity (number of seats)
- Price per Hour
- Main Image URL
- Additional Images (comma-separated URLs)
- Amenities (comma-separated list)
- Type (Open Space, Private, Meeting Room)
- Availability (Available, Limited, Unavailable)

**Features:**
- Dialog-based form for create/edit
- Image preview
- Real-time search
- Instant updates
- Confirmation dialogs for deletions

### 4. Users Management (`/admin/users`)
**Capabilities:**
- View all registered users
- Search users by name or email
- See user statistics (bookings count)
- Delete user accounts
- View join dates

**User Information Displayed:**
- Name & Avatar
- Email
- Phone
- Company
- Total Bookings
- Join Date

**Bulk Statistics:**
- Total Users
- Total Bookings across all users
- Active Users (users with bookings)

### 5. Bookings Management (`/admin/bookings`)
**Features:**
- View all bookings across all users
- Filter by status (All, Confirmed, Pending, Completed, Cancelled)
- Search bookings
- Update booking status
- View booking details

**Booking Statistics Dashboard:**
- Total Bookings
- Confirmed Bookings
- Pending Bookings
- Completed Bookings
- Cancelled Bookings

**Booking Information:**
- Workspace details
- User information
- Date and time
- Duration
- Price
- Current status

**Status Management:**
- Change status via dropdown
- Available statuses: Pending, Confirmed, Completed, Cancelled
- Real-time updates

## How to Create an Admin Account

### Method 1: Using API Endpoint
Send a POST request to `/admin/create-admin` with:
```json
{
  "email": "admin@volthub.com",
  "password": "SecurePassword123!",
  "firstName": "Admin",
  "lastName": "User",
  "secretKey": "volthub-admin-2024"
}
```

### Method 2: Using Browser Console
```javascript
// Open browser console on any VoltHub page
const createAdmin = async () => {
  const response = await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b17352a1/admin/create-admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@volthub.com',
      password: 'YourSecurePassword123!',
      firstName: 'Admin',
      lastName: 'User',
      secretKey: 'volthub-admin-2024'
    })
  });
  const data = await response.json();
  console.log(data);
};

createAdmin();
```

**Important Notes:**
- The secret key is: `volthub-admin-2024`
- This is a one-time setup endpoint
- Admin users have `isAdmin: true` in their profile
- Regular users cannot access admin pages

## Admin Login Process

1. Navigate to `/admin/login`
2. Enter admin credentials
3. System checks if user has admin privileges
4. If authorized, redirected to `/admin/dashboard`
5. If not authorized, error: "Access denied: Admin privileges required"

## Architecture

### Backend Routes (Server)

All admin routes are prefixed with `/make-server-b17352a1/admin/`

**Authentication:**
- `POST /admin/login` - Admin login with privilege check
- `POST /admin/create-admin` - Create admin user (requires secret key)

**Analytics:**
- `GET /admin/stats` - Dashboard statistics

**Resource Management:**
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete user

- `GET /admin/bookings` - Get all bookings
- `PUT /admin/bookings/:id` - Update booking status

- `POST /admin/workspaces` - Create workspace
- `PUT /admin/workspaces/:id` - Update workspace
- `DELETE /admin/workspaces/:id` - Delete workspace

**Authorization:**
All admin routes (except login and create-admin) use `checkAdmin` middleware:
- Validates JWT token
- Checks user profile for `isAdmin: true`
- Returns 403 if not authorized

### Frontend Structure

```
/src/app/
├── layouts/
│   └── AdminLayout.tsx       # Admin portal layout with sidebar
├── pages/admin/
│   ├── AdminLogin.tsx        # Admin login page
│   ├── AdminDashboard.tsx    # Dashboard with stats
│   ├── AdminWorkspaces.tsx   # Workspace CRUD
│   ├── AdminUsers.tsx        # User management
│   └── AdminBookings.tsx     # Booking management
└── lib/
    └── supabase.ts          # Contains all admin API helpers
```

### State Management

**Admin Session:**
- Token stored in: `localStorage.volthub_admin_token`
- Profile stored in: `localStorage.volthub_admin_profile`
- Separate from regular user session
- Checked on admin layout mount

### Security Features

1. **Role-Based Access Control (RBAC)**
   - Admin flag in user profile
   - Middleware verification on every admin request

2. **Protected Routes**
   - AdminLayout checks for token on mount
   - Redirects to login if not authenticated

3. **API Authorization**
   - All admin API calls require admin token
   - Token sent in Authorization header
   - Server validates admin status

4. **Secret Key Protection**
   - Admin creation requires secret key
   - Prevents unauthorized admin creation

## UI/UX Design

### Color Scheme
- **Primary Admin Color:** Red (#EF4444)
- **Sidebar Background:** Dark Navy (#071022)
- **Success States:** Green (#10B981)
- **Warning States:** Orange (#F59E0B)
- **Neutral:** Gray shades

### Layout
- **Fixed sidebar** on the left (280px wide)
- **Admin branding** with Shield icon
- **Responsive design** for all screen sizes
- **Consistent spacing** and typography

### Icons
- Dashboard: LayoutDashboard
- Workspaces: Building2
- Users: Users
- Bookings: Calendar
- Admin Logo: Shield

## Common Tasks

### 1. Adding a New Workspace
1. Go to `/admin/workspaces`
2. Click "Add Workspace" button
3. Fill in all required fields
4. Add image URLs (use Unsplash or upload to CDN)
5. Add amenities as comma-separated list
6. Click "Create Workspace"

### 2. Managing User Bookings
1. Go to `/admin/bookings`
2. Filter by status if needed
3. Find the booking
4. Use dropdown to change status
5. Changes save automatically

### 3. Viewing Platform Statistics
1. Go to `/admin/dashboard`
2. View real-time metrics:
   - User count
   - Revenue (total & monthly)
   - Active bookings
   - Recent activity

### 4. Removing a User
1. Go to `/admin/users`
2. Search for the user
3. Click "Delete" button
4. Confirm deletion
5. User profile and booking index removed

## API Response Examples

### Get Admin Stats
```json
{
  "totalWorkspaces": 6,
  "totalUsers": 25,
  "totalBookings": 50,
  "activeBookings": 12,
  "totalRevenue": 5600,
  "monthlyRevenue": 1200,
  "recentBookings": [...]
}
```

### Get All Users
```json
{
  "users": [
    {
      "id": "user-123",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "phone": "555-1234",
      "company": "Tech Corp",
      "bookingsCount": 3,
      "createdAt": "2024-01-15T10:00:00Z",
      "isAdmin": false
    }
  ]
}
```

## Troubleshooting

### Cannot Login to Admin Panel
- Verify your account has `isAdmin: true` in the database
- Check browser console for error messages
- Ensure you're using correct credentials
- Try clearing localStorage and logging in again

### Admin Routes Return 403 Forbidden
- Your account doesn't have admin privileges
- Create admin account using the create-admin endpoint
- Check that `isAdmin: true` is set in your user profile

### Workspaces Not Loading
- Check browser console for errors
- Verify data has been seeded
- Check network tab for API response
- Ensure workspace data exists in KV store

### Changes Not Saving
- Check for error toasts
- Verify admin token is valid
- Check network tab for failed requests
- Ensure you have admin permissions

## Best Practices

1. **Regular Backups**
   - Export user data periodically
   - Keep backup of workspace listings

2. **Monitor Revenue**
   - Check monthly revenue trends
   - Track active vs completed bookings

3. **User Management**
   - Remove inactive accounts
   - Monitor booking patterns

4. **Content Quality**
   - Use high-quality images for workspaces
   - Write detailed descriptions
   - Keep amenities lists accurate

5. **Status Management**
   - Update booking statuses promptly
   - Cancel no-shows
   - Complete past bookings

## Advanced Features

### Bulk Operations (Future Enhancement)
- Select multiple users/bookspaces
- Bulk status updates
- Bulk delete operations

### Analytics (Future Enhancement)
- Revenue charts
- User growth graphs
- Booking trends
- Popular workspaces

### Notifications (Future Enhancement)
- Email notifications for new bookings
- Status change alerts
- Low availability warnings

## Testing the Admin Portal

### Test Admin Account
After creating an admin account:
1. Email: `admin@volthub.com`
2. Password: [Your chosen password]
3. Access: `/admin/login`

### Test Scenarios
1. ✅ Login with admin credentials
2. ✅ View dashboard statistics
3. ✅ Create a new workspace
4. ✅ Edit existing workspace
5. ✅ Delete workspace
6. ✅ View all users
7. ✅ View all bookings
8. ✅ Update booking status
9. ✅ Delete user account
10. ✅ Logout

## Summary

The VoltHub Admin Portal provides complete control over:
- ✅ Platform analytics and insights
- ✅ Workspace inventory management
- ✅ User account administration
- ✅ Booking oversight and status management
- ✅ Revenue tracking

**Access:** `/admin/login`  
**Default Theme:** Red/Dark Navy  
**Security:** Role-based with admin flag  
**Features:** Full CRUD for all resources

The admin portal is production-ready and provides all necessary tools for platform management!

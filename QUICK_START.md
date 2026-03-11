# VoltHub - Quick Start Guide 🚀

## What You Have

VoltHub is now a **fully functional coworking space booking platform** with:

✅ **User Portal** - Browse, book, and manage workspace reservations  
✅ **Admin Portal** - Complete management system for platform operations  
✅ **Real Backend** - Supabase integration with authentication and data persistence  
✅ **Professional UI** - Premium design with VoltHub branding

---

## 🎯 First Steps

### 1. Create Admin Account (First Time Only)

Visit: **`/admin/setup`**

Fill in:
- First Name & Last Name
- Email Address
- Password (min 8 characters)
- Secret Key: `volthub-admin-2024`

Click "Create Admin Account" → You'll be redirected to admin login

### 2. Access Admin Portal

Visit: **`/admin/login`**

Use the credentials you just created

**Admin Portal Features:**
- Dashboard with analytics
- Workspace management (Create/Edit/Delete)
- User management
- Booking oversight
- Revenue tracking

### 3. Test User Experience

Visit: **`/auth/signup`**

Create a regular user account (no secret key needed)

**User Portal Features:**
- Browse workspaces
- Make bookings
- View booking history
- Manage profile

---

## 📱 Portal URLs

### User Portal
- **Homepage/Dashboard:** `/`
- **Sign Up:** `/auth/signup`
- **Sign In:** `/auth/login`
- **Browse Workspaces:** `/workspaces`
- **My Bookings:** `/my-bookings`
- **Profile:** `/profile`

### Admin Portal
- **Setup (First Time):** `/admin/setup`
- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Manage Workspaces:** `/admin/workspaces`
- **Manage Users:** `/admin/users`
- **Manage Bookings:** `/admin/bookings`

---

## 🔑 Default Credentials

### Admin Account
After setup, your chosen credentials

**Secret Key:** `volthub-admin-2024`

### Test User Account
Create any user account at `/auth/signup`

Example:
- Email: `user@test.com`
- Password: `Test123!`

---

## 🎨 Brand Colors

- **Primary Blue:** #0052FF (User portal)
- **Dark Navy:** #071022 (Backgrounds)
- **Accent Cyan:** #00D4FF (Highlights)
- **Admin Red:** #EF4444 (Admin portal)

---

## 📊 Admin Portal Guide

### Dashboard (`/admin/dashboard`)
View real-time statistics:
- Total workspaces, users, bookings
- Revenue (total & monthly)
- Recent booking activity

### Workspaces Management (`/admin/workspaces`)
**Create New Workspace:**
1. Click "Add Workspace"
2. Fill in details:
   - Name, Location, Description
   - Capacity, Price per Hour
   - Image URLs (use Unsplash)
   - Amenities (comma-separated)
   - Type & Availability
3. Click "Create Workspace"

**Edit Workspace:**
- Click edit icon on any workspace
- Update fields
- Click "Update Workspace"

**Delete Workspace:**
- Click trash icon
- Confirm deletion

### Users Management (`/admin/users`)
- View all registered users
- See booking counts
- Search by name/email
- Delete user accounts

### Bookings Management (`/admin/bookings`)
- View all platform bookings
- Filter by status
- Update booking status
- Track revenue per booking

---

## 👥 User Portal Guide

### Sign Up & Login
1. Go to `/auth/signup`
2. Enter details (no secret key needed)
3. Auto-login after signup

### Browse Workspaces
1. Visit `/workspaces`
2. Use filters:
   - Search by name/location
   - Filter by type
   - Price range
   - Amenities
   - Capacity
3. Click "View Details" or "Book Now"

### Make a Booking
1. Select workspace
2. Choose date and time
3. See price calculation
4. Confirm booking
5. View in "My Bookings"

### Manage Bookings
1. Go to `/my-bookings`
2. See tabs: All, Upcoming, Past, Cancelled
3. Cancel bookings if needed

---

## 🔐 Security Features

### User Portal
- JWT authentication
- Session persistence
- Protected routes
- Password validation

### Admin Portal
- Separate admin authentication
- Role-based access (isAdmin flag)
- Secret key for admin creation
- Protected admin routes
- Separate token storage

---

## 💾 Data Structure

### Workspaces
Stored as: `workspace:{id}`
```json
{
  "id": "1",
  "name": "Downtown Creative Hub",
  "location": "123 Main St, San Francisco, CA",
  "description": "Modern coworking space...",
  "capacity": 12,
  "pricePerHour": 25,
  "rating": 4.8,
  "reviewCount": 124,
  "image": "https://...",
  "images": ["https://...", "https://..."],
  "amenities": ["WiFi", "Coffee Bar", ...],
  "type": "open",
  "availability": "available"
}
```

### Users
Stored as: `user:{userId}`
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "name": "John Doe",
  "phone": "",
  "company": "",
  "isAdmin": false,
  "createdAt": "2024-03-11T..."
}
```

### Bookings
Stored as: `booking:{bookingId}`
```json
{
  "id": "VOL-123456",
  "userId": "user-id",
  "workspaceId": "1",
  "workspaceName": "Downtown Creative Hub",
  "workspaceImage": "https://...",
  "location": "123 Main St...",
  "date": "2024-03-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "duration": 8,
  "totalPrice": 200,
  "status": "confirmed",
  "createdAt": "2024-03-11T..."
}
```

---

## 🛠️ Common Tasks

### Add Sample Workspaces
1. Login to admin portal
2. Go to `/admin/workspaces`
3. Click "Add Workspace"
4. Use Unsplash for images:
   - Search "office" or "coworking"
   - Copy image URL
5. Add amenities: `WiFi, Coffee Bar, Parking`
6. Set appropriate price and capacity

### Test Booking Flow
1. Create user account
2. Browse workspaces
3. Select workspace
4. Choose date/time
5. Confirm booking
6. Check "My Bookings"
7. Login as admin
8. View booking in admin panel

### Monitor Platform
1. Login to admin
2. Check dashboard stats
3. Review recent bookings
4. Monitor user growth
5. Track revenue

---

## 🐛 Troubleshooting

### Can't Login
- Clear browser localStorage
- Check password requirements (min 6 chars)
- Try different browser/incognito

### Admin Access Denied
- Ensure you used `/admin/setup` with correct secret key
- Check that account has `isAdmin: true`
- Try creating new admin account

### Workspaces Not Showing
- Data seeds automatically on first load
- Check browser console for errors
- Reload page
- Check Network tab for API errors

### Bookings Not Saving
- Ensure you're logged in
- Check that token exists in localStorage
- Verify workspace exists
- Check browser console for errors

---

## 📈 Next Steps

### Recommended Enhancements
1. **Payment Integration**
   - Add Stripe for booking payments
   - Handle refunds for cancellations

2. **Email Notifications**
   - Booking confirmations
   - Status updates
   - Reminders

3. **Reviews & Ratings**
   - User reviews for workspaces
   - Rating system
   - Review moderation (admin)

4. **Advanced Search**
   - Map view
   - Availability calendar
   - Real-time availability

5. **Analytics Dashboard**
   - Charts and graphs
   - Revenue trends
   - Popular workspaces
   - User demographics

---

## 📝 Important Notes

### For Development
- Regular users: Use `/auth/signup`
- Admin users: Use `/admin/setup` first
- All data persists in Supabase KV store
- Sessions maintained via localStorage

### For Production
- Change admin secret key
- Set up email server for notifications
- Configure proper domain
- Add SSL certificate
- Set up monitoring
- Implement rate limiting

---

## ✨ Key Features Summary

### User Experience
- ✅ Modern, responsive design
- ✅ Workspace browsing with filters
- ✅ Real-time booking
- ✅ Booking management
- ✅ User profiles
- ✅ Session persistence

### Admin Experience
- ✅ Comprehensive dashboard
- ✅ Full CRUD for workspaces
- ✅ User management
- ✅ Booking oversight
- ✅ Revenue tracking
- ✅ Status management

### Technical
- ✅ Supabase backend
- ✅ JWT authentication
- ✅ Role-based access
- ✅ RESTful API
- ✅ Protected routes
- ✅ Error handling

---

## 🎉 You're Ready!

Your VoltHub platform is fully operational with:
- Complete user booking system
- Full-featured admin portal
- Real backend with data persistence
- Professional UI/UX

**Start with:** `/admin/setup` to create your admin account, then explore!

For detailed documentation:
- Backend details: `/BACKEND_INTEGRATION_GUIDE.md`
- Admin features: `/ADMIN_PORTAL_GUIDE.md`

Happy booking! 🚀

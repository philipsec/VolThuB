# VoltHub - Figma UI Design Brief

## 📱 Project Overview

**App Name:** VoltHub  
**Purpose:** Premium coworking space booking platform  
**Target Users:** Professionals, freelancers, remote workers, small teams  
**Platform:** Web (React) - Desktop & Tablet optimized  
**Status:** MVP with authentication, workspaces, and bookings  

---

## 🎯 Core Value Proposition

VoltHub connects professionals with premium coworking spaces. Users can:
- Browse available coworking spaces with filters
- Book workspaces by date and time
- Manage their bookings and profile
- Administrators manage workspace inventory and bookings

---

## 👥 User Personas

### 1. **Freelance Professional**
- Needs flexible coworking spaces
- Wants to see prices, amenities, and availability
- Books spaces regularly (weekly/monthly)
- Values filters by location, capacity, price

### 2. **Admin/Workspace Manager**
- Manages workspace inventory
- Creates/edits workspace listings
- Views booking analytics
- Manages user bookings

### 3. **Remote Team Lead**
- Books spaces for team meetings
- Needs large capacity spaces
- Books in advance
- Wants to see recurring booking options

---

## 🎨 Design System

### Color Palette

```
Primary Colors:
- Brand Blue: #0052FF (CTA buttons, active states)
- Dark Navy: #071022 (Dark backgrounds, text)
- Accent Cyan: #00D4FF (Highlights, hover states)

Neutral Colors:
- White: #FFFFFF (Backgrounds, cards)
- Light Gray: #F3F4F6 (Secondary backgrounds)
- Medium Gray: #9CA3AF (Secondary text)
- Dark Gray: #374151 (Primary text)

Status Colors:
- Success Green: #10B981 (Confirmed bookings)
- Warning Orange: #F59E0B (Pending status)
- Error Red: #EF4444 (Errors, cancellations)
- Info Blue: #3B82F6 (Information)

GradientBackground:
- Gradient: #071022 → #071a2a (Dark blue gradient)
```

### Typography

```
Font Family: Inter or Segoe UI (Sans-serif)

Heading Sizes:
- H1: 48px, Bold (700), Line: 1.2
- H2: 36px, Bold (700), Line: 1.3
- H3: 24px, Semi-Bold (600), Line: 1.4
- H4: 20px, Semi-Bold (600), Line: 1.5
- H5: 16px, Medium (500), Line: 1.5

Body Text:
- Body Large: 16px, Regular (400), Line: 1.6
- Body Regular: 14px, Regular (400), Line: 1.5
- Body Small: 12px, Regular (400), Line: 1.4

Labels & Captions:
- Label: 14px, Medium (500)
- Caption: 12px, Regular (400)
```

### Spacing Scale

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Border Radius

```
sm: 4px (borders, small elements)
md: 8px (cards, buttons)
lg: 12px (modals, large components)
xl: 16px (featured cards)
full: 50% (avatars, badges)
```

---

## 📐 Screen Inventory

### Authentication Flow
1. **Login Page**
2. **Signup Page**
3. **2FA Setup Modal** (with QR code)
4. **2FA Verification Step**
5. **Password Reset Flow** (email form, token verify, new password)

### User Portal
6. **Dashboard/Home** (greeting, quick stats, recent bookings)
7. **Workspaces Browse** (grid/list view, filters, search)
8. **Workspace Details** (full info, amenities, pricing, reviews)
9. **Booking Form** (date picker, time selector, total price)
10. **Booking Confirmation** (receipt, calendar add, download)
11. **My Bookings** (list, filter by status, cancel, reschedule)
12. **User Profile** (edit info, 2FA settings, password change)
13. **Settings** (preferences, notifications, account)

### Admin Portal
14. **Admin Dashboard** (analytics, key metrics, activity)
15. **Workspaces Management** (CRUD operations)
16. **Workspace Creation Form** (name, location, amenities, pricing)
17. **Bookings Management** (list, filter, edit status)
18. **Users Management** (list, view details, deactivate)
19. **Analytics & Reports** (charts, trends, revenue)

---

## 🔐 Authentication Pages

### 1. Login Page
**Layout:**
- Vertical center split screen (optional: image on left)
- Left side: Brand logo, tagline
- Right side: Login form

**Components:**
- Logo (centered top)
- H1: "Welcome Back"
- Body text: "Sign in to book your perfect workspace"
- Email input field (with email icon)
- Password input field (with show/hide toggle)
- "Forgot Password?" link (right-aligned)
- Primary button: "Sign In" (full width, disabled while loading)
- Divider: "OR"
- Secondary button: "Sign Up" (outline style)
- Loading spinner (on button during request)
- Error message banner (red background, dismissible)
- 2FA input (conditional, appears after password)

**States:**
- Default
- Focused (input border highlight)
- Error (red border, error text)
- Loading (button disabled, spinner)
- 2FA Required (show TOTP input field)

---

### 2. Signup Page
**Layout:**
- Full-width form centered
- Dark gradient background

**Components:**
- Logo (centered top)
- H1: "Join VoltHub"
- Body text: "Create your account to start booking"
- First Name input
- Last Name input
- Email input
- Password input (with strength indicator)
- Confirm Password input
- Checkbox: "I agree to Terms of Service"
- Primary button: "Create Account"
- Divider with "OR"
- "Sign In" link (secondary)
- Field-level error messages (red text below input)
- Password strength bar (gray → yellow → green)

**Validations:**
- Real-time email validation
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Password match validation
- Required field indicators

---

### 3. Password Reset Flow
**Step 1 - Request Reset:**
- Email input field
- "Send Reset Link" button
- "Back to Login" link

**Step 2 - Confirmation:**
- Success message: "Check your email"
- Message: "We sent a password reset link to [email]"
- "Resend" button (disabled until 60 seconds passed)
- "Back to Login" link

**Step 3 - Reset Form:**
- New Password input (with strength indicator)
- Confirm Password input
- "Reset Password" button
- "Back to Login" link

---

## 🏠 User Portal - Home/Dashboard

**Layout:** Sidebar Navigation + Main Content Area

**Navigation Sidebar:**
- VoltHub logo (clickable, goes to home)
- User avatar (circle, clickable → profile dropdown)
- Menu items:
  - Dashboard (home icon)
  - Explore Workspaces (search icon)
  - My Bookings (calendar icon)
  - Profile (user icon)
  - Settings (gear icon)
- Logout button (bottom)

**Dashboard Content:**
- Header: "Welcome, [User First Name]"
- Greeting message (varies by time: "Good morning", "Good afternoon")
- 4-column stats row:
  - Card 1: "Active Bookings" (count, icon)
  - Card 2: "Hours Booked This Month" (number, icon)
  - Card 3: "Favorite Spaces" (count, icon)
  - Card 4: "Account Status" (status badge)
- Section: "Upcoming Bookings" (list with calendar, location, time)
- Section: "Recently Viewed Spaces" (3-column grid)
- CTA Button: "Browse All Workspaces"

---

## 🔍 Workspaces Browse Page

**Layout:**
- Header with search bar
- Left sidebar: Filters (sticky)
- Main content: Workspaces grid

**Search & Filter Bar:**
- Search input: "Search by location or workspace name"
- Filter button (mobile): Opens sidebar
- Sort dropdown: "Most Popular", "Lowest Price", "Highest Rated"

**Filter Sidebar:**
- H3: "Filters"
- Price range slider (min-max with $ display)
- Capacity checkboxes (2-4, 4-8, 8+)
- Amenities multi-select:
  - WiFi (checkbox)
  - Meeting Rooms (checkbox)
  - Parking (checkbox)
  - Coffee Bar (checkbox)
  - Phone Booths (checkbox)
  - Standing Desks (checkbox)
- Availability date picker
- "Apply Filters" button
- "Clear All" link

**Workspaces Grid:**
- 3-column layout (responsive: 2 on tablet, 1 on mobile)
- Each card:
  - Image (16:9 aspect ratio, hover zoom effect)
  - Star rating (e.g., ⭐4.8)
  - Workspace name (H3)
  - Location (with map pin icon)
  - Capacity badge (e.g., "Seats: 8")
  - Amenities icons (row of small icons)
  - Price per hour (large, bold, blue)
  - "Book Now" button (primary)
  - "View Details" button (secondary)
  - Availability indicator (green badge: "Available")

---

## 📋 Workspace Details Page

**Layout:**
- Image carousel (hero, full width)
- Content below

**Components:**
- Image gallery (main hero + thumbnails)
- H1: Workspace name
- Star rating & review count link
- Location & map embed
- Description paragraph
- Amenities section (grid of icons with labels)
- Pricing section:
  - Price per hour (large)
  - Type (dedicated desk, private office, meeting room)
  - Capacity
  - Features list
- Availability calendar (date selector)
- Time picker (start time, end time)
- Price breakdown:
  - 1 hour × $50/hr = $50
  - (Real-time calculation)
- "Book Now" button (primary, CTA)
- Similar workspaces section (horizontal scroll)
- Reviews section (rating distribution, user reviews)

---

## 📅 Booking Page

**Layout:**
- Breadcrumb: Workspaces > [Workspace Name] > Book
- Form on left (60%), preview on right (40%)

**Left Side - Booking Form:**
- H2: "Complete Your Booking"
- Date input (calendar picker)
- Start time input (time picker, dropdown)
- End time input (time picker, dropdown)
- Duration display (auto-calculated, gray text)
- Recurring option (checkbox: "Book recurring")
  - If checked: Frequency dropdown (Daily, Weekly, Monthly)
  - End date picker
- Special requirements textarea (optional)
- Promo code input (with "Apply" button)
- "Back" button (secondary)
- "Continue to Payment" button (primary)

**Right Side - Booking Summary:**
- Card: "Booking Summary"
- Details:
  - Workspace image (small)
  - Workspace name
  - Date
  - Time
  - Duration
  - Divider
  - Price per hour
  - Quantity (hours)
  - Subtotal
  - Tax (if applicable)
  - Discount (if promo code applied)
  - **Total (large, bold)**
- "Booking Terms" checkbox: "I agree to cancellation policy"
- Status: "Your workspace is being held for 10 minutes"

---

## ✅ Booking Confirmation Page

**Layout:**
- Centered card on gradient background

**Components:**
- Success icon (large, green checkmark animation)
- H1: "Booking Confirmed!"
- Confirmation number: "Booking #VOL-2024-12345"
- Order details card:
  - Workspace image (thumbnail)
  - Workspace name
  - Location
  - Date & time (with icons)
  - Duration
  - Total price (green)
- Actions:
  - "Add to Calendar" button (with calendar icon)
  - "Download Receipt" button (PDF download)
  - "View in My Bookings" button
- Section: "What's next?"
  - Checklist items:
    - ☐ Arrive 10 minutes early
    - ☐ Check workspace amenities on arrival
    - ☐ Contact support if needed
- "Browse More Spaces" link (secondary)
- "Back to Dashboard" button (primary)

---

## 📅 My Bookings Page

**Layout:**
- Tabs: "All", "Upcoming", "Past", "Cancelled"
- List view with filters

**Filter Bar:**
- Search by workspace name
- Date range picker
- Sort by: "Newest", "Earliest", "Price"
- View toggle: List / Calendar

**Booking Cards (List View):**
- Workspace image (left, thumbnail)
- Details (middle):
  - Workspace name (bold)
  - Location
  - Date & Time
  - Duration & total price
- Status badge (right):
  - Green: "Confirmed"
  - Orange: "Pending"
  - Red: "Cancelled"
  - Blue: "Completed"
- Quick actions (right):
  - Three-dot menu:
    - "Reschedule"
    - "Cancel"
    - "Download Receipt"
    - "Contact Support"

**Calendar View:**
- Month calendar
- Bookings highlighted on dates
- Click date to see bookings for that day

---

## 👤 User Profile Page

**Layout:**
- Left sidebar: Profile menu (sticky)
- Main content: Form fields

**Profile Menu:**
- Profile picture (large, clickable avatar)
- User name
- User email
- Menu items:
  - General Info
  - 2FA Settings
  - Change Password
  - Preferences
  - Account Deletion

**General Info Tab:**
- Profile picture upload (drag & drop, circular)
- First name input
- Last name input
- Email input (with "Verify" button if not verified)
- Phone number input (optional)
- Bio textarea (optional)
- Save button (primary)

**2FA Settings Tab:**
- Toggle: "Two-Factor Authentication" (off/on)
- If enabled:
  - Authenticator app section
  - Backup codes section (with copy/regenerate buttons)
- If disabled:
  - "Enable 2FA" button
  - Description: "Increases account security"

**Change Password Tab:**
- Current password input
- New password input (with strength indicator)
- Confirm password input
- "Update Password" button (primary)

---

## 🎛️ Admin Portal - Dashboard

**Layout:**
- Sidebar navigation
- Main content with KPI cards

**Admin Navigation:**
- Logo
- Profile dropdown
- Menu:
  - Dashboard
  - Workspaces
  - Bookings
  - Users
  - Analytics
  - Settings
- Logout button

**Dashboard Content:**

**KPI Section (4 cards in 2x2 grid):**
- Card 1: Total Bookings (month)
  - Large number
  - % change vs last month (green up arrow)
  - Sparkline chart trend
- Card 2: Revenue (month)
  - Large amount
  - % change
  - Sparkline
- Card 3: Active Users
  - Large number
  - % change
  - Sparkline
- Card 4: Workspace Utilization
  - Percentage
  - % change
  - Sparkline

**Charts Section:**
- Line chart: "Bookings Over Time" (last 30 days)
- Bar chart: "Revenue by Workspace"
- Pie chart: "Booking Status Distribution" (Confirmed, Pending, Cancelled)

**Recent Activity:**
- Table: Latest bookings
- Columns: User, Workspace, Date, Price, Status
- Rows: 5 most recent

---

## 🏢 Admin - Workspaces Management

**Layout:**
- Header with "+ New Workspace" button
- Workspaces table

**Workspaces Table:**
- Columns: Name, Location, Capacity, Price/hr, Bookings (month), Status, Actions
- Sortable columns (click header)
- Filterable rows
- Pagination (10 per page)
- Each row has dropdown actions:
  - Edit
  - View Bookings
  - View Analytics
  - Duplicate
  - Deactivate/Activate

**Create/Edit Workspace Form (Modal/Page):**
- H2: "Create New Workspace" / "Edit Workspace"
- Sections:
  - Basic Info:
    - Name (input)
    - Description (textarea)
    - Location (input with autocomplete)
    - Cover image (upload)
  - Details:
    - Capacity (number input)
    - Workspace type (dropdown: Open, Private, Meeting Room)
    - Price per hour (currency input)
    - Availability hours (time range)
  - Amenities:
    - Checkboxes for: WiFi, Conference Call, Parking, Coffee, Phone Booth, Standing Desk, Whiteboard, Printer, TV Display
  - Gallery:
    - Multiple image upload
    - Thumbnail preview
    - Drag to reorder
  - SEO:
    - Meta title
    - Meta description
    - Keywords

- Action buttons:
  - "Save" (primary)
  - "Cancel" (secondary)

---

## 📊 Admin - Bookings Management

**Layout:**
- Filters and table

**Filters:**
- Date range picker
- Workspace filter (dropdown)
- User search
- Status filter (Confirmed, Pending, Cancelled)
- Sort by: Date, User, Workspace, Price

**Bookings Table:**
- Columns: User, Workspace, Date, Time, Duration, Price, Status, Actions
- Status badges (color-coded)
- Actions dropdown: Edit, Cancel, View User, Download Receipt

**Bulk Actions:**
- Checkboxes for multi-select
- Bulk delete / bulk change status

---

## 👥 Admin - Users Management

**Layout:**
- Search, filters, table

**User List Table:**
- Columns: Name, Email, Signup Date, Bookings (count), Status, Actions
- Sortable
- Searchable by name/email
- Filter by status (Active, Inactive, Banned)

**User Details Modal:**
- Name
- Email
- Signup date
- Phone
- Bookings (count)
- Total spent
- Last booking date
- Status toggle (Active/Inactive/Banned)
- History table (show last 5 bookings)
- Actions:
  - Send message
  - Reset password
  - Deactivate/Activate
  - Delete account

---

## 🎨 Component Library

### Buttons
```
Primary Button:
- Background: #0052FF
- Text: White
- Padding: 12px 24px
- Border radius: 8px
- Font: 16px Medium
- Hover: Background #0042CC, shadow
- Disabled: Opacity 0.5, cursor not-allowed

Secondary Button:
- Background: Transparent
- Border: 2px solid #0052FF
- Text: #0052FF
- Same padding, border-radius, font
- Hover: Background #F3F4F6

Outline Button:
- Border: 1px solid #D1D5DB
- Background: Transparent
- Hover: Background #F3F4F6

Danger Button:
- Background: #EF4444
- Text: White (same styling as primary)
```

### Input Fields
```
Text Input:
- Height: 44px
- Border: 1px solid #D1D5DB
- Border radius: 8px
- Padding: 12px 16px
- Font: 14px Regular
- Focus: Border #0052FF, box-shadow
- Error: Border #EF4444

Label:
- Font: 14px Medium
- Color: #374151
- Margin bottom: 8px

Helper text:
- Font: 12px Regular
- Color: #9CA3AF
```

### Cards
```
Card Container:
- Background: White
- Border radius: 12px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px
- Hover: Shadow 0 10px 25px rgba(0,0,0,0.1)

Image Card:
- Border radius: 8px
- Aspect ratio: 16:9
- Object fit: Cover
```

### Badges
```
Status Badge:
- Confirmed: Green background (#10B981), white text, 8px padding
- Pending: Orange background (#F59E0B), white text
- Cancelled: Red background (#EF4444), white text
- Completed: Gray background (#6B7280), white text

Availability Badge:
- Available: Green
- Unavailable: Red
- Limited (< 2 hours): Orange
```

### Modals
```
Modal Container:
- Background: White
- Border radius: 16px
- Box shadow: 0 20px 25px rgba(0,0,0,0.15)
- Max width: 600px (adjust per use)
- Padding: 32px
- Overlay: Dark background with 0.5 opacity

Modal Header:
- H2 or H3
- Close button (X) top right

Modal Footer:
- Button group (usually 2 buttons)
- Spacing: 16px between buttons
```

### Navigation
```
Sidebar:
- Width: 280px (desktop), collapse to 80px (icon only)
- Background: Dark navy #071022
- Text: White

Menu Items:
- Height: 44px
- Padding: 12px 16px
- Font: 14px Medium
- Icon: 20px (left aligned)
- Active: Blue background (#0052FF)
- Hover: Gray background (#374151)

Breadcrumb:
- Font: 12px Regular
- Separator: "/"
- Active: #374151
- Link: #0052FF (hover: underline)
```

---

## 🔄 User Flows

### User Registration & Login Flow
1. User lands on login page
2. Can toggle to signup
3. Fills signup form with validation
4. Account created, auto-login
5. Redirected to dashboard
6. Optional: 2FA setup prompted

### Booking Flow
1. Browse workspaces with filters
2. Click workspace card
3. View details
4. Click "Book Now"
5. Select date & time
6. Review price
7. Confirm booking
8. See confirmation
9. Add to calendar / download receipt
10. Booking in "My Bookings" tab

### Admin Workspace Management
1. Admin logs in
2. Goes to Workspaces tab
3. Views all workspaces
4. Click "New Workspace"
5. Fills form with details, images, amenities
6. Saves
7. Workspace appears in list and is available for booking

---

## 📱 Responsive Design Breakpoints

```
Desktop: 1280px+ (primary)
Tablet: 768px - 1279px
Mobile: < 768px

Key changes:
- Mobile: Single column layouts, full-width cards, bottom navigation
- Tablet: 2 columns, sidebars collapse
- Desktop: 3+ columns, full sidebars
```

---

## ♿ Accessibility Requirements

- **WCAG 2.1 AA** compliance
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- All inputs must have labels
- Error messages must be screen-reader friendly
- Images must have alt text
- Icons must have aria-labels
- Focus management in modals
- Keyboard navigation support
- Form validation feedback accessible

---

## 🎬 Micro-interactions & Animations

```
Loading States:
- Skeleton screens for content blocks
- Spinners on buttons (loading)
- Fade-in animations for page content (200ms)

Transitions:
- Button hover: 200ms ease
- Modal open: 300ms ease-out
- Page navigation: 200ms fade
- Sidebar collapse: 300ms ease

Feedback:
- Success: Green toast notification (3s dismiss)
- Error: Red toast notification (5s dismiss)
- Info: Blue toast notification (3s dismiss)
- Click feedback: Subtle scale animation on buttons
```

---

## 🔒 Security & Data Display

- Passwords: Masked by default, toggle to show
- Sensitive data: Blur/mask on listing pages (show only in modals)
- Confirmation dialogs: Before delete/cancel operations
- Session timeout: Display warning before auto-logout
- Error messages: Generic for security (not "user doesn't exist")

---

## 📊 Analytics Integration Points

- Page views (track dashboard, bookings, workspace details)
- User actions (click book, filter workspaces, complete signup)
- Conversion funnels (signup → first booking)
- Performance metrics (page load time, API response time)

---

## 🎯 Design Priorities

1. **Clear Call-to-Actions:** "Book Now", "Explore Workspaces" prominent
2. **Simple Navigation:** Consistent sidebar + top bar
3. **Quick Booking:** Minimal steps (Browse → Details → Book → Confirm)
4. **Trust Signals:** Reviews, ratings, confirmed badges
5. **Mobile First:** All layouts responsive
6. **Accessibility:** Easy to navigate with keyboard only
7. **Performance:** Fast load times, lazy-load images

---

## 📝 Design Handoff Notes

**For Figma AI or Design Tools:**

When generating designs, ensure:
- All colors match the palette (use #hex codes exactly)
- Typography follows the scale (sizes, weights, line-heights)
- Spacing uses the defined scale (4px, 8px, 16px, 24px, etc.)
- Components are reusable and follow the component library
- All interactive elements have hover/focus/active states
- Forms have clear validation and error states
- Responsive layouts are tested at 375px, 768px, 1280px
- Dark backgrounds use the gradient: #071022 → #071a2a
- Icons are consistent style (outline or solid, not mixed)
- All text has proper contrast ratio (WCAG AA minimum)

---

## 🚀 Phase-Based Implementation

**Phase 1 (MVP):**
- Login / Signup
- Browse workspaces
- Book workspace
- My bookings (view only)
- User profile

**Phase 2 (Enhancement):**
- 2FA setup
- Password reset
- Workspace alerts/favorites
- Review & ratings
- Promo codes

**Phase 3 (Admin):**
- Admin dashboard
- Workspace management (CRUD)
- Bookings management
- User management
- Analytics & reports

---

## 🎨 Design Tokens for Development

```json
{
  "colors": {
    "primary": "#0052FF",
    "primaryDark": "#0042CC",
    "secondary": "#00D4FF",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6",
    "dark900": "#071022",
    "dark800": "#1F2937",
    "gray100": "#F3F4F6",
    "gray500": "#9CA3AF",
    "gray700": "#374151"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "h1": {"size": "48px", "weight": 700},
    "h2": {"size": "36px", "weight": 700},
    "body": {"size": "16px", "weight": 400}
  }
}
```

---

**Last Updated:** March 4, 2026  
**Version:** 1.0 - Ready for Figma AI Design Generation

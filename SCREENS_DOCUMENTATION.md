# Internify - Screen Documentation

## Overview
This document lists all screens in the Internify project with their file paths and purposes.

---

## 🔐 Authentication & Onboarding Screens

### 1. Splash Screen
**Path:** `src/splashscreen.jsx`  
**Purpose:** Initial app loading screen with animated "Internify" branding. Shows typing animation, bouncing dot, and screen expansion effect before transitioning to the main app.

### 2. Login Screen
**Path:** `src/login.jsx`  
**Purpose:** User authentication screen. Allows users to sign in with email/password or social login (Google, GitHub). Integrates with Supabase Auth and fetches user role from database.

### 3. Signup Screen
**Path:** `src/signup.jsx`  
**Purpose:** New user registration screen. Collects full name, email, password, and creates account in Supabase Auth and user table with default role 'student'.

### 4. Payment Screen
**Path:** `src/payment.jsx`  
**Purpose:** Payment checkout screen shown after successful login/signup. Displays mentorship plan summary, escrow explanation, and payment form. Required before accessing dashboard.

---

## 🏠 Main Application Screens

### 5. Landing Page (App.jsx)
**Path:** `src/App.jsx`  
**Purpose:** Main landing page with hero section, featured mentors, courses, how it works, highlights, and outcomes. Entry point for non-authenticated users.

### 6. Explore/Search Screen
**Path:** `src/search.jsx`  
**Purpose:** Search and browse screen for courses and mentors. Features tabbed interface (Courses/Mentors), search functionality, filtering by course, and displays results from Supabase API.

### 7. Mentor Profile Screen
**Path:** `src/mentorProfile.jsx`  
**Purpose:** Public profile page for individual mentors. Shows mentor details, courses, testimonials, focus areas, and booking options. Accessible from explore/search screens.

---

## 👨‍🎓 Student Dashboard Screens

### 8. Student Dashboard Shell
**Path:** `src/Dashboard.jsx`  
**Purpose:** Main container for student dashboard. Provides navigation bar (Home, Calendar, Profile), theme toggle, notifications, and routes to student-specific screens.

### 9. Student Home Screen
**Path:** `src/pages/Home.jsx`  
**Purpose:** Student dashboard home page. Displays:
- Welcome message and quick actions
- Progress overview cards (Learning hours, Assessment status, Registered courses)
- Featured Sessions section
- My Classes carousel with enrolled courses
- Progress graph
- Upcoming sessions sidebar
- Compact calendar

### 10. Student Home (Wrapper)
**Path:** `src/pages/student_dashboard/Home.jsx`  
**Purpose:** Wrapper that re-exports the main Home.jsx for student dashboard organization.

### 11. Student Calendar Screen
**Path:** `src/pages/Calendar.jsx`  
**Purpose:** Calendar view for students to manage sessions. Shows:
- Mini calendar widget
- List of upcoming sessions
- Action buttons: Reschedule, Cancel Class, Join Now

### 12. Student Calendar (Wrapper)
**Path:** `src/pages/student_dashboard/Calendar.jsx`  
**Purpose:** Wrapper that re-exports Calendar.jsx for student dashboard.

### 13. Student Profile Screen
**Path:** `src/pages/Profile.jsx`  
**Purpose:** Student profile page with:
- Profile header with cover photo and avatar
- Stats (Courses Completed, In Progress, Mentorship Sessions, Certificates)
- About section
- Internships timeline
- Skills section
- Certifications display

### 14. Student Profile (Wrapper)
**Path:** `src/pages/student_dashboard/Profile.jsx`  
**Purpose:** Wrapper that re-exports Profile.jsx for student dashboard.

### 15. Student Notification Screen
**Path:** `src/pages/Notification.jsx`  
**Purpose:** Notification center for students. Shows session reminders, course updates, mentor messages, achievements, assignment due dates, and system updates. Includes filtering (All/Unread/Read).

### 16. Student Notification (Wrapper)
**Path:** `src/pages/student_dashboard/Notification.jsx`  
**Purpose:** Wrapper that re-exports Notification.jsx for student dashboard.

---

## 📚 Course Management Screens (Student)

### 17. My Courses Screen
**Path:** `src/pages/MyCourses.jsx`  
**Purpose:** List view of all enrolled courses with status details. Shows:
- Course cards with mentor info
- Status badges (Completed, In Progress, Not Started)
- Progress bars
- Course stats (Sessions, Assignments, Next Session)
- Clickable cards that navigate to CourseDetail

### 18. Course Detail Screen
**Path:** `src/pages/CourseDetail.jsx`  
**Purpose:** Detailed view of a single course. Displays:
- Course header with badges, title, description, rating
- Progress section with "Enter Classroom" button
- Mentor section (clickable to view mentor profile)
- Upcoming session info
- Course stats
- All Sessions list
- Assignments list
- Resources list

### 19. Live Classroom Screen
**Path:** `src/liveClassroom.jsx`  
**Purpose:** Interactive live classroom interface. Features:
- Session navigation sidebar
- Chat/messaging interface
- File sharing
- Link sharing
- Self-notes functionality
- Code highlighting
- Session timeline

---

## 👨‍🏫 Mentor Dashboard Screens

### 20. Mentor Dashboard Shell
**Path:** `src/MentorDashboard.jsx`  
**Purpose:** Main container for mentor dashboard. Provides navigation bar (Home, Calendar, Profile), theme toggle, notifications, and routes to mentor-specific screens.

### 21. Mentor Home Screen
**Path:** `src/pages/mentor_dashboard/Home.jsx`  
**Purpose:** Mentor dashboard home page. Displays:
- Welcome message for mentor
- Stats cards (Mentees Today, Sessions This Week, Pending Reviews, Unread Messages)
- Today's Mentee Sessions list
- Selected Session details card

### 22. Mentor Calendar Screen
**Path:** `src/pages/mentor_dashboard/Calendar.jsx`  
**Purpose:** Calendar view for mentors to manage mentee sessions. Shows:
- Mini calendar widget
- List of scheduled sessions with mentee names
- Action buttons: Reschedule, Join Now

### 23. Mentor Profile Screen
**Path:** `src/pages/mentor_dashboard/Profile.jsx`  
**Purpose:** Mentor's own profile page. Displays:
- Profile header with name, role, location
- Stats (Years of Experience, Mentees Coached, Focus Areas, Top Companies)
- About section
- Focus areas tags
- Weekly availability schedule

### 24. Mentor Notification Screen
**Path:** `src/pages/mentor_dashboard/Notification.jsx`  
**Purpose:** Notification center for mentors. Shows:
- New session bookings
- Work pending review
- Payout notifications
- Mentee messages
- Includes filtering (All/Unread/Read)

---

## 📊 Screen Flow Summary

### Unauthenticated Flow:
1. Splash Screen → Landing Page → Login/Signup → Payment → Dashboard

### Student Flow:
1. Student Dashboard → Home (My Classes) → My Courses → Course Detail → Live Classroom
2. Student Dashboard → Calendar (View/Manage Sessions)
3. Student Dashboard → Profile (View/Edit Profile)
4. Student Dashboard → Notifications

### Mentor Flow:
1. Mentor Dashboard → Home (Today's Sessions) → Live Classroom
2. Mentor Dashboard → Calendar (Manage Sessions)
3. Mentor Dashboard → Profile (View/Edit Profile)
4. Mentor Dashboard → Notifications

### Public Flow:
1. Landing Page → Explore/Search → Mentor Profile → Login/Signup

---

## 🔄 Role-Based Routing

- **Login** fetches user role from Supabase `user` table
- **Role = 'mentor'** → Routes to `MentorDashboard`
- **Role = 'student'** (or default) → Routes to `Dashboard` (Student Dashboard)

---

## 📁 File Organization

```
src/
├── App.jsx                    # Main app & landing page
├── Dashboard.jsx              # Student dashboard shell
├── MentorDashboard.jsx        # Mentor dashboard shell
├── login.jsx                  # Login screen
├── signup.jsx                 # Signup screen
├── payment.jsx                # Payment screen
├── splashscreen.jsx           # Splash screen
├── search.jsx                 # Explore/Search screen
├── mentorProfile.jsx          # Public mentor profile
├── liveClassroom.jsx          # Live classroom interface
├── pages/
│   ├── Home.jsx               # Student home (main)
│   ├── Calendar.jsx           # Student calendar (main)
│   ├── Profile.jsx            # Student profile (main)
│   ├── Notification.jsx       # Student notifications (main)
│   ├── MyCourses.jsx          # My courses list
│   ├── CourseDetail.jsx       # Course detail view
│   ├── student_dashboard/     # Student dashboard wrappers
│   │   ├── Home.jsx
│   │   ├── Calendar.jsx
│   │   ├── Profile.jsx
│   │   └── Notification.jsx
│   └── mentor_dashboard/      # Mentor dashboard screens
│       ├── Home.jsx
│       ├── Calendar.jsx
│       ├── Profile.jsx
│       └── Notification.jsx
```

---

## 🎯 Key Features by Screen Type

### Authentication Screens:
- Supabase Auth integration
- Role-based user creation
- Payment gateway integration

### Student Screens:
- Course enrollment tracking
- Progress monitoring
- Session management
- Assignment tracking
- Live classroom access

### Mentor Screens:
- Mentee session management
- Work review capabilities
- Availability scheduling
- Payout tracking

### Shared Features:
- Theme toggle (dark/light)
- Responsive design
- Notification system
- Calendar integration


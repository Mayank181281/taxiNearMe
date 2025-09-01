# TaxiNearMe Admin Panel

A comprehensive admin panel for managing the TaxiNearMe taxi service website.

## Features

### Authentication

- **Login Page**: Secure admin authentication
- **Hardcoded Credentials**:
  - Username: `admin`
  - Password: `password`
- **Session Management**: Persistent login with localStorage

### Dashboard

- **Key Metrics**: Total users, active drivers, pending ads, monthly revenue
- **User Signups Chart**: Visual representation of user signups over the last week
- **Recent Activity**: Real-time activity feed
- **Quick Actions**: Direct access to common admin tasks

### Ad Management

- **Advertisement Review**: View and manage submitted advertisements
- **Approval System**: Approve or reject pending advertisements
- **Filter Options**: Filter by status (pending, approved, rejected)
- **Detailed View**: View complete advertisement details in modal
- **Status Tracking**: Track advertisement status changes

### User Management

- **User Overview**: Complete list of registered users
- **User Details**: View detailed user information
- **Filter Options**: Filter by status, account type, and search functionality
- **Account Management**: Tools for user account management

## Access

Navigate to `/admin` to access the admin panel.

## Technologies Used

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Authentication**: Local storage based session management

## File Structure

```
src/admin/
├── contexts/
│   └── AdminAuthContext.tsx    # Admin authentication context
├── pages/
│   ├── AdminLogin.tsx          # Login page
│   ├── AdminDashboard.tsx      # Main dashboard layout
│   ├── Dashboard.tsx           # Dashboard content
│   ├── AdManagement.tsx        # Advertisement management
│   └── UserManagement.tsx      # User management
└── Admin.tsx                   # Main admin component
```

## Demo Data

The admin panel comes with realistic dummy data for:

- User accounts with different roles and statuses
- Advertisement submissions with various subscription plans
- Activity logs and metrics
- Charts and statistics

## Security Features

- **Protected Routes**: Admin routes are protected by authentication
- **Session Management**: Automatic session validation
- **Logout Functionality**: Secure session termination
- **Role-based Access**: Admin-only functionality

## Usage

1. Navigate to `/admin`
2. Login with credentials: `admin` / `password`
3. Use the sidebar to navigate between different sections
4. Manage advertisements, users, and view analytics
5. Use the logout button to securely end the session

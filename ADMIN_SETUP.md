# 🛡️ ShipSquared Admin System Setup

## 🎯 How Admin Users Work

### **Automatic Admin Assignment**
- Any user who registers with an email ending in `@shipsquared.com` is automatically assigned the **admin** role
- Regular users (non-shipsquared.com emails) are assigned the **user** role
- Admin users are automatically redirected to `/admin` instead of `/dashboard`

### **Role-Based Access Control**
- **Admin users** (`@shipsquared.com`): Access to admin dashboard and all admin features
- **Regular users**: Access to client dashboard only
- Middleware automatically redirects users based on their role

---

## 🚀 How to Create an Admin User

### **Method 1: Register with @shipsquared.com Email**
1. Go to `/signup`
2. Fill out the registration form with:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Store Name**: "ShipSquared Admin" (or any name)
   - **Email**: `yourname@shipsquared.com` (must end with @shipsquared.com)
   - **Password**: Your secure password
3. Click "Register"
4. You'll be automatically assigned admin role and redirected to `/admin`

### **Method 2: Manual Database Update (if needed)**
If you need to make an existing user an admin:

```sql
UPDATE User 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 🏠 Admin Dashboard Features

### **Main Dashboard (`/admin`)**
- **Overview Statistics**: Total users, orders, shipments, revenue
- **Quick Navigation**: Access to all admin sections
- **Real-time Data**: Live platform statistics

### **User Management (`/admin/users`)**
- **View All Users**: Complete list of registered clients
- **User Details**: Name, email, store, order count, platform connections
- **Activity Tracking**: When users joined and their activity levels

### **Planned Admin Sections**
- **Orders Overview** (`/admin/orders`): Monitor all platform orders
- **Shipment Management** (`/admin/shipments`): Track all shipments
- **Revenue Analytics** (`/admin/analytics`): Financial performance
- **Platform Integrations** (`/admin/integrations`): Manage connections
- **System Settings** (`/admin/settings`): Platform configuration

---

## 🔐 Security Features

### **Authentication**
- JWT-based sessions with NextAuth.js
- Secure password hashing with bcrypt
- Role-based access control

### **Route Protection**
- Middleware automatically redirects users based on role
- Admin routes (`/admin/*`) require admin role
- Client routes (`/dashboard/*`) require user role
- Unauthorized access attempts are redirected

### **API Security**
- All admin API endpoints verify admin role
- Session validation on every request
- Proper error handling and logging

---

## 🎨 Admin Interface

### **Layout**
- **Header**: ShipSquared Admin branding with user info and sign out
- **Sidebar**: Navigation to all admin sections
- **Main Content**: Dynamic content area for each section

### **Design**
- Clean, professional interface
- Responsive design for all screen sizes
- Consistent with ShipSquared branding
- Loading states and error handling

---

## 🔄 How It Works

### **Registration Flow**
```
User registers with @shipsquared.com email
    ↓
System automatically assigns 'admin' role
    ↓
User is redirected to /admin dashboard
    ↓
Admin can access all admin features
```

### **Login Flow**
```
Admin logs in with @shipsquared.com email
    ↓
System checks role in database
    ↓
Admin is redirected to /admin dashboard
    ↓
Regular users are redirected to /dashboard
```

### **Route Protection**
```
User tries to access /admin
    ↓
Middleware checks user role
    ↓
If admin: Allow access
    ↓
If not admin: Redirect to /dashboard
```

---

## 🛠️ Technical Implementation

### **Database Schema**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      String   @default("user") // "user" or "admin"
  firstName String?
  lastName  String?
  storeName String?
  // ... other fields
}
```

### **NextAuth Configuration**
- Enhanced with role information
- JWT tokens include user role
- Session includes admin privileges

### **Middleware**
- Route-based access control
- Automatic redirects based on role
- Protection for admin and client routes

---

## 🧪 Testing the Admin System

### **Test Admin Registration**
1. Visit `/signup`
2. Register with `test@shipsquared.com`
3. Verify you're redirected to `/admin`
4. Check that you can access admin features

### **Test Regular User Registration**
1. Visit `/signup`
2. Register with `test@example.com`
3. Verify you're redirected to `/dashboard`
4. Try accessing `/admin` - should redirect to `/dashboard`

### **Test Admin Features**
1. Login as admin
2. Visit `/admin/users` - should show user list
3. Check admin stats on main dashboard
4. Verify navigation works correctly

---

## 🚨 Important Notes

### **Email Domain Requirement**
- **Only** emails ending in `@shipsquared.com` get admin access
- This is a security feature to prevent unauthorized admin access
- Regular users cannot become admins through the UI

### **Production Considerations**
- Ensure your domain is properly configured
- Monitor admin user creation
- Consider additional security measures for production
- Regular security audits recommended

### **Backup and Recovery**
- Regular database backups
- Admin user recovery procedures
- Emergency access protocols

---

## 📞 Support

If you need help with the admin system:
1. Check this documentation
2. Review the code in `/src/app/admin/`
3. Check the API routes in `/src/app/api/admin/`
4. Verify your email domain ends with `@shipsquared.com`

---

**Built with ❤️ for ShipSquared Admin Team** 
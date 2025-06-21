# 🧭 ShipSquared Routing Behavior Guide

## 🎯 **How Routing Works Now**

### **Smart Role-Based Redirection**
The system now intelligently routes users based on their authentication status and role:

---

## 🔐 **Authentication Status & Routing**

### **Unauthenticated Users**
- **Any URL** → Redirected to `/login`
- **Exception**: Public pages (`/login`, `/signup`, `/unauthorized`) remain accessible

### **Authenticated Users**
- **Role-based redirection** based on email domain:
  - `@shipsquared.com` emails → Admin routes (`/admin`)
  - All other emails → Client routes (`/dashboard`)

---

## 📍 **URL-Specific Behavior**

### **Root URL (`/`)**
```
Unauthenticated → /login
Admin User → /admin
Regular User → /dashboard
```

### **Dashboard Routes (`/dashboard/*`)**
```
Unauthenticated → /login
Admin User → /admin (redirected)
Regular User → /dashboard (allowed)
```

### **Admin Routes (`/admin/*`)**
```
Unauthenticated → /login
Admin User → /admin (allowed)
Regular User → /dashboard (redirected)
```

### **Random/Invalid URLs**
```
Unauthenticated → /login
Admin User → /admin (redirected)
Regular User → /dashboard (redirected)
```

### **Public Pages**
```
/login, /signup, /unauthorized → Always accessible
```

---

## 🔄 **Complete Flow Examples**

### **Scenario 1: Admin User Navigation**
```
User: admin@shipsquared.com (authenticated)

/ → /admin
/dashboard → /admin (redirected)
/admin → /admin (allowed)
/admin/users → /admin/users (allowed)
/some-random-url → /admin (redirected)
/login → /login (allowed, but unnecessary)
```

### **Scenario 2: Regular User Navigation**
```
User: client@example.com (authenticated)

/ → /dashboard
/dashboard → /dashboard (allowed)
/admin → /dashboard (redirected)
/admin/users → /dashboard (redirected)
/some-random-url → /dashboard (redirected)
/login → /login (allowed, but unnecessary)
```

### **Scenario 3: Unauthenticated User**
```
User: Not logged in

/ → /login
/dashboard → /login
/admin → /login
/some-random-url → /login
/login → /login (allowed)
/signup → /signup (allowed)
```

---

## 🛡️ **Security Features**

### **Route Protection**
- **All non-public routes** require authentication
- **Role-based access** enforced at middleware level
- **Automatic redirects** prevent unauthorized access

### **Public Routes (Always Accessible)**
- `/login` - Login page
- `/signup` - Registration page
- `/unauthorized` - Access denied page
- `/api/*` - API endpoints (handled separately)
- Static files and images

### **Protected Routes**
- `/` - Root (redirects based on role)
- `/dashboard/*` - Client dashboard
- `/admin/*` - Admin dashboard
- Any other URL - Redirects based on role

---

## 🧪 **Testing Scenarios**

### **Test 1: Admin User**
1. Register with `test@shipsquared.com`
2. Try visiting:
   - `/` → Should redirect to `/admin`
   - `/dashboard` → Should redirect to `/admin`
   - `/admin` → Should work
   - `/random-url` → Should redirect to `/admin`

### **Test 2: Regular User**
1. Register with `test@example.com`
2. Try visiting:
   - `/` → Should redirect to `/dashboard`
   - `/admin` → Should redirect to `/dashboard`
   - `/dashboard` → Should work
   - `/random-url` → Should redirect to `/dashboard`

### **Test 3: Unauthenticated**
1. Clear cookies/session
2. Try visiting:
   - `/` → Should redirect to `/login`
   - `/dashboard` → Should redirect to `/login`
   - `/admin` → Should redirect to `/login`
   - `/login` → Should work

---

## 🔧 **Technical Implementation**

### **Middleware Logic**
```typescript
// Check user role
const isAdmin = token?.role === "admin";

// Handle root URL
if (pathname === "/") {
  if (isAdmin) return redirect("/admin");
  else return redirect("/dashboard");
}

// Handle protected routes
if (isAdminRoute && !isAdmin) return redirect("/dashboard");
if (isClientRoute && isAdmin) return redirect("/admin");
```

### **Route Matcher**
```typescript
matcher: [
  "/((?!api|_next/static|_next/image|favicon.ico|login|signup|unauthorized).*)"
]
```

This matches all routes EXCEPT:
- API routes (`/api/*`)
- Static files (`/_next/static/*`)
- Images (`/_next/image/*`)
- Public pages (`/login`, `/signup`, `/unauthorized`)

---

## 🚨 **Important Notes**

### **No 404s for Authenticated Users**
- Authenticated users will **never see a 404 page**
- All invalid URLs redirect to their appropriate dashboard
- This provides a seamless user experience

### **Security Through Redirection**
- Users can't access unauthorized areas
- All attempts are gracefully redirected
- No error messages that could reveal system structure

### **Performance**
- Middleware runs on every request
- Redirections are fast and efficient
- No unnecessary page loads

---

## 📊 **Summary Table**

| User Type | Root (/) | /dashboard | /admin | Random URL |
|-----------|----------|------------|--------|------------|
| **Unauthenticated** | → /login | → /login | → /login | → /login |
| **Admin** | → /admin | → /admin | ✅ /admin | → /admin |
| **Regular** | → /dashboard | ✅ /dashboard | → /dashboard | → /dashboard |

**Legend:**
- `→` = Redirected
- `✅` = Allowed access

---

**This routing system ensures users always end up in the right place! 🎯** 
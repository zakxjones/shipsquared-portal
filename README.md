# 🚀 ShipSquared Client Portal

Welcome to the ShipSquared secure client portal! A comprehensive e-commerce order management and fulfillment platform.

## 🎯 Dashboard Goals

ShipSquared Portal is designed to be the central hub for e-commerce businesses to:

- **Unify Order Management**: Connect and manage orders from multiple platforms (Shopify, Amazon, eBay, Etsy, TikTok)
- **Streamline Fulfillment**: Create shipments, track packages, and manage inventory
- **Track Performance**: Monitor revenue, order volume, and shipping metrics in real-time
- **Simplify Logistics**: Handle inbound shipments and coordinate with ShipStation
- **Grow Business**: Manage referrals and track business growth

---

## 📦 Project Setup

### 1️⃣ Clone & Install

```bash
git clone <your-repo-url>
cd shipsquared-portal
npm install
```

### 2️⃣ Configure Environment Variables

Create a `.env.local` in the root and add your Supabase credentials. You can get these from your Supabase project dashboard.

```env
# Get these from your Supabase project's API settings
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# This is the direct Postgres connection string for Prisma
# Get this from your Supabase project's Database settings
DATABASE_URL="your-supabase-postgres-connection-string"

# A secret string for NextAuth to sign tokens
NEXTAUTH_SECRET="your-super-secret-string"
```

🔑 **Tip:** Use `openssl rand -base64 32` to generate a strong `NEXTAUTH_SECRET`.

### 3️⃣ Initialize the Database

This command will sync your Prisma schema with your Supabase database.

```bash
npx prisma db push
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Visit:
- Sign Up → [http://localhost:3000/signup](http://localhost:3000/signup)
- Login → [http://localhost:3000/login](http://localhost:3000/login)
- Dashboard → [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## ✅ Core Features

### 🔐 Authentication & User Management
- **Secure Registration**: First name, last name, store name, email, and password
- **NextAuth.js Integration**: JWT-based sessions with Prisma adapter
- **Role-based Access**: User and admin roles
- **Password Security**: bcrypt hashing

### 📊 Dashboard Analytics
- **Real-time Stats**: Today's and yesterday's revenue, orders, and shipments
- **Performance Metrics**: Order volume tracking and revenue analysis
- **ShipStation Integration**: Automatic order import and sync

### 🔗 Platform Integrations
- **Multi-platform Support**: Shopify, Amazon, eBay, Etsy, TikTok
- **OAuth Connections**: Secure platform authentication
- **Order Synchronization**: Real-time order data from all platforms
- **Unified Interface**: Single dashboard for all e-commerce activity

### 📦 Order Management
- **Order Tracking**: View and manage orders from all connected platforms
- **Status Updates**: Real-time order status synchronization
- **Customer Information**: Complete customer details and addresses
- **Order History**: Comprehensive order tracking and analytics

### 🚚 Shipment Management
- **Create Shipments**: Generate shipping labels and track packages
- **Carrier Integration**: Support for multiple shipping carriers
- **Tracking Numbers**: Automatic tracking number assignment
- **Shipment History**: Complete shipment tracking and analytics

### 📥 Inbound Shipments
- **ShipSquared Logistics**: Coordinate inbound shipments through ShipSquared
- **Manual Freight**: Support for self-coordinated freight shipments
- **Tracking Integration**: Real-time shipment tracking
- **Status Management**: Track shipment status from origin to destination

### 💰 Referral System
- **Business Referrals**: Track and manage business referrals
- **Referral Bonuses**: Monitor referral qualification and payment status
- **Lead Management**: Store and track potential business leads
- **Performance Analytics**: Referral success metrics

### 🏪 Inventory Management
- **Stock Tracking**: Monitor inventory levels across platforms
- **Inventory Alerts**: Low stock notifications
- **Product Management**: Centralized product catalog

### 💳 Billing & Payments
- **Billing Dashboard**: Track subscription and usage
- **Payment History**: Complete payment and invoice history
- **Usage Analytics**: Platform usage and cost tracking

---

## 🚀 Deploying

1. Push your project to GitHub
2. Deploy to [Vercel](https://vercel.com)
3. Add these env vars in Vercel dashboard:
   - `DATABASE_URL` (for production, use Postgres)
   - `NEXTAUTH_SECRET` (same as local)
4. Done!

---

## ⚡️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with [NextAuth.js](https://next-auth.js.org/) for session management
- **Database**: [Supabase Postgres](https://supabase.com/database)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Cron Jobs**: [node-cron](https://www.npmjs.com/package/node-cron)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── dashboard/         # Dashboard analytics
│   │   ├── integrations/      # Platform connections
│   │   ├── orders/           # Order management
│   │   ├── shipments/        # Shipment operations
│   │   └── referrals/        # Referral system
│   ├── dashboard/             # Main dashboard pages
│   │   ├── billing/          # Billing management
│   │   ├── integrations/     # Platform connections
│   │   ├── inventory/        # Inventory management
│   │   ├── orders/           # Order views
│   │   ├── referrals/        # Referral management
│   │   └── shipments/        # Shipment management
│   ├── admin/                # Admin panel
│   ├── login/                # Authentication pages
│   └── signup/               # User registration
├── components/               # Reusable UI components
├── lib/                     # Utility libraries
│   ├── platforms/           # Platform integrations
│   ├── cron/               # Background jobs
│   └── prisma.ts           # Database client
└── types/                  # TypeScript definitions
```

---

## 🔄 Recent Updates

### ✅ User Registration Enhancement
- Added first name, last name, and store name fields
- Enhanced user profile management
- Improved registration flow

### ✅ Code Cleanup
- Removed debug console.log statements
- Cleaned up unused dependencies (Supabase)
- Optimized Prisma logging for production
- Improved error handling

### ✅ Database Schema
- Complete user management system
- Multi-platform order tracking
- Shipment and inventory management
- Referral and billing systems

---

## 🏁 Ready to scale?

- ✅ Add email verification
- ✅ Implement webhook notifications
- ✅ Add advanced analytics
- ✅ Integrate with more shipping carriers
- ✅ Add mobile app support
- ✅ Implement advanced inventory forecasting

---

**Built with ❤️ by Zak for ShipSquared**

---

## 📬 Questions?

Open an issue or reach out!
Happy shipping. 📦✨

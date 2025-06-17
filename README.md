# 🚀 ShipSquared Client Portal

Welcome to the ShipSquared secure client portal!  
This project uses:
- ✅ Next.js (App Router)
- ✅ NextAuth.js with Prisma Adapter
- ✅ Credentials-based email + password login
- ✅ SQLite for easy local dev (Postgres recommended for production)
- ✅ Fully typed, hashed passwords with bcrypt

---

## 📦 Project Setup

### 1️⃣ Clone & Install

```bash
git clone <your-repo-url>
cd shipsquared-portal
npm install
````

---

### 2️⃣ Configure Environment Variables

Create a `.env.local` in the root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-string"
```

🔑 **Tip:**
Use `openssl rand -base64 32` to generate a strong `NEXTAUTH_SECRET`.

---

### 3️⃣ Initialize the Database

Prisma will create your local SQLite DB and tables:

```bash
npx prisma migrate dev --name init
```

---

### 4️⃣ Run Locally

```bash
npm run dev
```

Visit:

* Sign Up → [http://localhost:3000/signup](http://localhost:3000/signup)
* Login → [http://localhost:3000/login](http://localhost:3000/login)
* Dashboard → [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

*(Adjust port if needed — yours is `3002` if you kept your setup!)*

---

## ✅ Features

* **Sign Up:**
  Securely register a user — password is hashed and stored via Prisma.

* **Login:**
  Validate email + password using NextAuth Credentials provider.

* **Sessions:**
  JWT-based sessions for stateless, secure auth.

* **Protected Pages:**
  Example `/dashboard` requires login.

---

## 🚀 Deploying

1. Push your project to GitHub.

2. Deploy to [Vercel](https://vercel.com).

3. Add these env vars in Vercel dashboard:

   * `DATABASE_URL` (for production, use Postgres)
   * `NEXTAUTH_SECRET` (same as local)

4. Done!

---

## ⚡️ Tech Stack

* [Next.js](https://nextjs.org/)
* [NextAuth.js](https://next-auth.js.org/)
* [Prisma](https://www.prisma.io/)
* [SQLite](https://www.sqlite.org/index.html) for dev
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

## 🗂️ Folder Highlights

```
src/
 ├── app/
 │    ├── api/auth/[...nextauth]/route.ts  # NextAuth config
 │    ├── api/auth/signup/route.ts         # Signup API route
 │    ├── signup/page.tsx                   # Signup form
 │    ├── login/page.tsx                    # Login form
 │    ├── dashboard/page.tsx                # Protected page
```

---

## 🏁 Ready to build more?

* ✅ Add email verification
* ✅ Add user roles & permissions
* ✅ Connect to Stripe or ShipStation
* ✅ Go production-ready with Postgres

---

**Built with ❤️ by Zak for ShipSquared**

---

## 📬 Questions?

Open an issue or reach out!
Happy shipping. 📦✨

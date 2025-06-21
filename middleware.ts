import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const pathname = req.nextUrl.pathname;

    // Debug logging
    console.log('🔍 Middleware Debug:', {
      email: token?.email,
      role: token?.role,
      isAdmin,
      pathname,
      shouldBeAdmin: token?.email?.toLowerCase().endsWith('@shipsquared.com')
    });

    // Define protected routes
    const isAdminRoute = pathname.startsWith("/admin");
    const isClientRoute = pathname.startsWith("/dashboard");
    const isProtectedRoute = isAdminRoute || isClientRoute;

    // If accessing a protected route
    if (isProtectedRoute) {
      // If user is admin and trying to access client routes, redirect to admin
      if (isAdmin && isClientRoute) {
        console.log('🔄 Admin redirecting from /dashboard to /admin');
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // If user is not admin and trying to access admin routes, redirect to dashboard
      if (!isAdmin && isAdminRoute) {
        console.log('🔄 User redirecting from /admin to /dashboard');
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // If accessing root URL, redirect based on role
    if (pathname === "/") {
      if (isAdmin) {
        console.log('🔄 Root redirecting admin to /admin');
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        console.log('🔄 Root redirecting user to /dashboard');
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, signup, unauthorized (public pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|unauthorized).*)",
  ],
};

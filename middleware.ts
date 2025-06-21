import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isClientRoute = req.nextUrl.pathname.startsWith("/dashboard");

    // If user is admin and trying to access client routes, redirect to admin
    if (isAdmin && isClientRoute) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // If user is not admin and trying to access admin routes, redirect to dashboard
    if (!isAdmin && isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

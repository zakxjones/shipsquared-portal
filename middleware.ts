import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const { token } = request.nextauth;

    // Check if the user is trying to access the admin dashboard
    if (pathname.startsWith("/admin")) {
      // If there is no token (user not logged in) or the user is not an admin, redirect
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
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
     * Match all paths except for:
     * - api routes
     * - static files
     * - public pages like login, signup
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|unauthorized).*)",
  ],
};

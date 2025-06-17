export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - the login page
     * - public files (e.g. favicon.ico)
     * - the NextAuth API route
     */
    "/((?!api/auth|login|favicon.ico).*)",
  ],
};

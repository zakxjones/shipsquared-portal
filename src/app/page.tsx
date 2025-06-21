"use client";
import { useSession } from "next-auth/react";
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // If user is authenticated, middleware will handle redirection
    // If not authenticated, they should go to login
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  // Show loading while session is being determined
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ShipSquared...</p>
        </div>
      </div>
    );
  }

  // If authenticated, middleware will redirect, so show loading
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

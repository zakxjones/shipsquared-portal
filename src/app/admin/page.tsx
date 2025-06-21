"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "admin") {
    router.replace("/login");
    return <div>Unauthorized</div>;
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">This is the admin dashboard. Here you will be able to view and manage all clients, shipments, and platform activity.</p>
      </div>
    </div>
  );
} 
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Package, Truck, DollarSign, TrendingUp, Settings } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalShipments: number;
  totalRevenue: number;
  activePlatforms: number;
  pendingReferrals: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [session]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!session?.user || session.user.role !== "admin") {
    router.replace("/login");
    return <div>Unauthorized</div>;
  }

  const adminSections = [
    {
      title: "User Management",
      description: "View and manage all client accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Order Overview",
      description: "Monitor all platform orders",
      icon: Package,
      href: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "Shipment Management",
      description: "Track and manage all shipments",
      icon: Truck,
      href: "/admin/shipments",
      color: "bg-purple-500"
    },
    {
      title: "Revenue Analytics",
      description: "View financial performance",
      icon: DollarSign,
      href: "/admin/analytics",
      color: "bg-yellow-500"
    },
    {
      title: "Platform Integrations",
      description: "Manage platform connections",
      icon: TrendingUp,
      href: "/admin/integrations",
      color: "bg-indigo-500"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Welcome Header */}
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Welcome back, {session.user.firstName || 'Admin'}! Manage your ShipSquared platform.
        </p>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="card flex flex-col items-center justify-center">
            <Users className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">{stats?.totalUsers || 0}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Total Users</span>
          </div>
          <div className="card flex flex-col items-center justify-center">
            <Package className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">{stats?.totalOrders || 0}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Total Orders</span>
          </div>
          <div className="card flex flex-col items-center justify-center">
            <Truck className="h-6 w-6 text-purple-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">{stats?.totalShipments || 0}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Total Shipments</span>
          </div>
          <div className="card flex flex-col items-center justify-center">
            <DollarSign className="h-6 w-6 text-yellow-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Total Revenue</span>
          </div>
          <div className="card flex flex-col items-center justify-center">
            <TrendingUp className="h-6 w-6 text-indigo-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">{stats?.activePlatforms || 0}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Active Platforms</span>
          </div>
          <div className="card flex flex-col items-center justify-center">
            <Users className="h-6 w-6 text-orange-500 mb-2" />
            <span className="text-lg font-bold text-gray-900">{stats?.pendingReferrals || 0}</span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">Pending Referrals</span>
          </div>
        </div>
      )}

      {/* Admin Sections */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <div
            key={section.title}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(section.href)}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${section.color}`}>
                <section.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
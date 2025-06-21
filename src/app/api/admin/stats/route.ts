import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get aggregated statistics
    const [
      totalUsers,
      totalOrders,
      totalShipments,
      totalRevenue,
      activePlatforms,
      pendingReferrals
    ] = await Promise.all([
      prisma.user.count({ where: { role: "user" } }),
      prisma.order.count(),
      prisma.shipment.count(),
      prisma.order.aggregate({
        where: { status: { in: ["paid", "fulfilled"] } },
        _sum: { total: true }
      }),
      prisma.platformConnection.count({ where: { isActive: true } }),
      prisma.referral.count({ where: { referralStatus: "pending" } })
    ]);

    return Response.json({
      totalUsers,
      totalOrders,
      totalShipments,
      totalRevenue: totalRevenue._sum.total || 0,
      activePlatforms,
      pendingReferrals
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
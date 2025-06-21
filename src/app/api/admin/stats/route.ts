import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has @shipsquared.com email
    const isAdmin = session.user.email.toLowerCase().endsWith('@shipsquared.com');
    
    if (!isAdmin) {
      return Response.json({ error: "Admin access requires @shipsquared.com email" }, { status: 403 });
    }

    // Get aggregated statistics
    const totalUsers = await prisma.user.count({ where: { role: "user" } });
    const totalOrders = await prisma.order.count();
    const totalShipments = await prisma.shipment.count();
    const totalRevenue = await prisma.order.aggregate({
      where: { status: { in: ["paid", "fulfilled"] } },
      _sum: { total: true }
    });
    const activePlatforms = await prisma.platformConnection.count({ where: { isActive: true } });
    const pendingReferrals = await prisma.referral.count({ where: { referralStatus: "pending" } });

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
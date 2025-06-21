import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = (date: Date) => {
      const d = new Date(date);
      return d >= today && d < tomorrow;
    };
    const isYesterday = (date: Date) => {
      const d = new Date(date);
      return d >= yesterday && d < today;
    };

    const todayOrders = orders.filter(o => isToday(o.createdAt));
    const yesterdayOrders = orders.filter(o => isYesterday(o.createdAt));

    const todayRevenue = todayOrders
      .filter(o => ["paid", "fulfilled"].includes(o.status))
      .reduce((sum, o) => sum + o.total, 0);
    const yesterdayRevenue = yesterdayOrders
      .filter(o => ["paid", "fulfilled"].includes(o.status))
      .reduce((sum, o) => sum + o.total, 0);

    const todayOrdersCount = todayOrders.length;
    const yesterdayOrdersCount = yesterdayOrders.length;
    const todayShipped = todayOrders.filter(o => o.status === "fulfilled").length;
    const yesterdayShipped = yesterdayOrders.filter(o => o.status === "fulfilled").length;

    return Response.json({
      todayRevenue,
      yesterdayRevenue,
      todayOrders: todayOrdersCount,
      yesterdayOrders: yesterdayOrdersCount,
      todayShipped,
      yesterdayShipped,
    });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
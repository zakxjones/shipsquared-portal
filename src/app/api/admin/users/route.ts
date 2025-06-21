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

    // Get all users with their order and platform connection counts
    const users = await prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        storeName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            platformConnections: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
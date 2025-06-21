import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "No session found" }, { status: 401 });
    }

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        storeName: true,
      }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      message: "Session refresh recommended",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        storeName: user.storeName,
      },
      currentSession: {
        role: session.user.role,
        email: session.user.email,
      },
      needsRefresh: session.user.role !== user.role
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
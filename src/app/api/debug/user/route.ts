import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ 
        error: "No session found",
        session: null 
      });
    }

    // Get user from database to compare
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
      }
    });

    return Response.json({
      session: {
        user: session.user,
        expires: session.expires
      },
      databaseUser: dbUser,
      isAdmin: session.user.role === 'admin',
      emailDomain: session.user.email.split('@')[1],
      shouldBeAdmin: session.user.email.toLowerCase().endsWith('@shipsquared.com')
    });
  } catch (error) {
    console.error("Debug error:", error);
    return Response.json({ error: "Debug failed" }, { status: 500 });
  }
} 
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import IntegrationsPageClient from "@/components/IntegrationsPageClient";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div className="p-8">You must be logged in to view this page.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { platformConnections: true },
  });

  const connectedPlatforms = user?.platformConnections.map((conn) => conn.platform) || [];

  return (
    <IntegrationsPageClient
      user={user}
      connectedPlatforms={connectedPlatforms}
    />
  );
} 
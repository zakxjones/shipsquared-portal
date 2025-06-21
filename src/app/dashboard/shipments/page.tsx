import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ShipmentsClient from "./ShipmentsClient";
import { redirect } from "next/navigation";

export default async function ShipmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <ShipmentsClient user={session.user} />
    </div>
  );
} 
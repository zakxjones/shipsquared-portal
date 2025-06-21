import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  // Simulate removing a user
  const { userId } = params;
  // In a real app, remove user from store in DB
  return Response.json({ success: true, removed: userId });
} 
import { NextRequest } from 'next/server';

const mockUsers = [
  { id: '1', email: 'owner@example.com', role: 'Owner' },
  { id: '2', email: 'member@example.com', role: 'Member' },
  { id: '3', email: 'pending@example.com', role: 'Invited' },
];

export async function GET() {
  // Return a static list of users for now
  return Response.json({ users: mockUsers });
}

export async function POST(req: NextRequest) {
  // Simulate inviting a user
  const { email } = await req.json();
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }
  // In a real app, send invite and add to DB
  return Response.json({ success: true, invited: email });
} 
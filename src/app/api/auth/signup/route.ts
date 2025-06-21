import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, storeName } = await req.json();

    if (!email || !password || !firstName || !lastName || !storeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Determine user role based on email domain
    const isAdmin = email.toLowerCase().endsWith('@shipsquared.com');
    const userRole = isAdmin ? 'admin' : 'user';

    // ✅ Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        storeName,
        role: userRole,
      },
    });

    return NextResponse.json({ 
      user: {
        ...user,
        password: undefined // Don't send password back
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

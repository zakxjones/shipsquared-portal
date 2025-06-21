import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, storeName } = await req.json();

    if (!email || !password || !firstName || !lastName || !storeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Step 1: Create the user in Supabase Auth ---
    // This will send a confirmation email.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // You can pass additional metadata here if needed
        data: {
          firstName,
          lastName,
          storeName,
        }
      }
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    if (!authData.user) {
      return NextResponse.json({ error: "Could not create user in Supabase" }, { status: 500 });
    }
    
    // --- Step 2: Create the user in your Prisma database ---
    // This keeps your local user profiles in sync with Supabase Auth.
    const isAdmin = email.toLowerCase().endsWith('@shipsquared.com');
    const userRole = isAdmin ? 'admin' : 'user';

    const userData: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      storeName: string;
      role: string;
    } = {
      id: authData.user.id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      storeName: storeName,
      role: userRole,
    };

    await prisma.user.create({
      data: userData,
    });

    return NextResponse.json({ 
      message: "Signup successful, please check your email for verification.",
      user: authData.user,
    }, { status: 201 });

  } catch (error) {
    // Check for Prisma-specific errors, like unique constraint violations
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
       return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    console.error("Signup process error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

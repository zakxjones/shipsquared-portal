import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          await cookieStore.set({ name, value, ...options })
        },
        async remove(name: string, options: CookieOptions) {
          await cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userFromDb = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!userFromDb) {
    // This case should ideally not happen if the user is authenticated
    // But as a fallback, we can create the user record here.
    const { email, id, user_metadata } = user
    const isAdmin = email?.toLowerCase().endsWith('@shipsquared.com')
    const role = isAdmin ? 'admin' : 'user'

    await prisma.user.create({
      data: {
        id: id,
        email: email ?? '',
        name: user_metadata.full_name || user_metadata.name,
        role: role,
      },
    })
    return NextResponse.json({ message: 'User profile created' })
  }

  // If user exists but is missing name (e.g., from an old signup flow), update them
  if (
    !userFromDb.name &&
    (user.user_metadata.full_name || user.user_metadata.name)
  ) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.user_metadata.full_name || user.user_metadata.name,
      },
    })
    return NextResponse.json({ message: 'User profile updated' })
  }

  return NextResponse.json({ message: 'User profile is already up-to-date' })
} 
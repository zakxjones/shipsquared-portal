"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [view, setView] = useState('sign-in');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setView('error');
    } else {
      setView('check-email');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {view === 'check-email' ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
            <p className="text-gray-500 mt-2">A sign in link has been sent to <span className="font-bold text-gray-800">{email}</span>.</p>
          </div>
        ) : view === 'error' ? (
          <div className="text-center">
             <h3 className="text-xl font-semibold text-red-600">Error</h3>
            <p className="text-gray-500 mt-2">Could not authenticate you. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <Image
                src="/shipsquared-logo.svg"
                alt="ShipSquared"
                width={200}
                height={50}
                className="mx-auto"
              />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
              Sign in with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in with Magic Link
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

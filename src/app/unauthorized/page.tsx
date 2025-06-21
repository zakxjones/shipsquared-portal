import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You do not have the necessary permissions to access this page.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          <p>Please log in with an administrator account to continue.</p>
          <p className="mt-1">If you believe this is an error, please contact support.</p>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
          <Link href="/login" className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Login as Admin
          </Link>
          <Link href="/dashboard" className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 
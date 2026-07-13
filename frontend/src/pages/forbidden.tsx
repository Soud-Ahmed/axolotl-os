import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-650 mb-6 shadow-inner">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">403</h1>
      <p className="mt-4 text-md text-gray-600 dark:text-gray-400 font-medium">Access Denied</p>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 max-w-sm">
        You do not have the required permissions or authentication level to view this module.
      </p>
      <Link to="/dashboard" className="mt-8">
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

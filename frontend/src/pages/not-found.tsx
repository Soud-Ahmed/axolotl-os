import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 mb-6 shadow-inner">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">404</h1>
      <p className="mt-4 text-md text-gray-600 dark:text-gray-400 font-medium">Page Not Found</p>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 max-w-sm">
        The page you are looking for does not exist or has been relocated to another workspace.
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

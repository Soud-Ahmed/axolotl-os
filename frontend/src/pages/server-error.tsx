import { RefreshCw, Home } from 'lucide-react';

interface ServerErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ServerErrorPage({ error, resetErrorBoundary }: ServerErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 mb-6 shadow-inner animate-bounce">
        <RefreshCw className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">500</h1>
      <p className="mt-4 text-md text-gray-600 dark:text-gray-400 font-medium">Internal Server Error</p>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 max-w-sm">
        {error?.message || 'Something went wrong inside the console dashboard. Please reload or contact support.'}
      </p>
      
      <div className="mt-8 flex justify-center gap-4">
        {resetErrorBoundary ? (
          <button 
            onClick={resetErrorBoundary}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        ) : (
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
        )}
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
        >
          <Home className="h-4 w-4" />
          Dashboard Home
        </button>
      </div>
    </div>
  );
}

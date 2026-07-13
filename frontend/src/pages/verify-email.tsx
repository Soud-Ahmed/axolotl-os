import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';

export function VerifyEmailPage() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || 'your email address';

  return (
    <Card className="border border-gray-200/60 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md">
      <CardHeader className="pb-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Verify Your Email
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Almost there! Let's verify your identity.
        </p>
      </CardHeader>
      <CardContent className="p-6 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.25V5.75C3 4.23122 4.23122 3 5.75 3H18.25C19.7688 3 21 4.23122 21 5.75V19.25C21 20.7688 19.7688 22 18.25 22H5.75C4.23122 22 3 20.7688 3 19.25Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.75L12 12.5L21 5.75" />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            We sent a verification link to:
          </p>
          <p className="text-sm font-semibold text-blue-650 break-all bg-gray-50 p-2 rounded border font-mono">
            {email}
          </p>
          <p className="text-xs text-gray-500 pt-2">
            Please check your inbox (and spam folder) and click the link to confirm your registration and unlock Axolotl-OS access.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-center">
          <Link to="/login" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

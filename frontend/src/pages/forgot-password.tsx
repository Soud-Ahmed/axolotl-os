import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';

interface ForgotPasswordFormInput {
  email: string;
}

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInput>();

  const onSubmit = (data: ForgotPasswordFormInput) => {
    forgotPassword.mutate(data.email, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  return (
    <Card className="border border-gray-200/60 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md">
      <CardHeader className="pb-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Enter your email to receive a password reset link
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {success ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.25V5.75C3 4.23122 4.23122 3 5.75 3H18.25C19.7688 3 21 4.23122 21 5.75V19.25C21 20.7688 19.7688 22 18.25 22H5.75C4.23122 22 3 20.7688 3 19.25Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12L11 14L15 10" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium">Reset link sent successfully!</p>
            <p className="text-xs text-gray-500">Check your inbox for instructions to reset your password.</p>
            <div className="pt-2">
              <Link to="/login" className="text-xs font-semibold text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@axolotlmedia.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />

            {forgotPassword.error && (
              <p className="text-xs text-red-650 bg-red-50 p-3 rounded-lg border border-red-200">
                {forgotPassword.error.message || 'Failed to send reset link'}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200"
              loading={forgotPassword.isPending}
            >
              Send Reset Link
            </Button>

            <p className="text-center text-xs text-gray-500 pt-2">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSignIn } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import type { SignInInput } from '../types/auth';

interface ExtendedSignInInput extends SignInInput {
  rememberMe: boolean;
}

export function LoginPage() {
  const signIn = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtendedSignInInput>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    }
  });

  const onSubmit = (data: ExtendedSignInInput) => {
    signIn.mutate(data);
  };

  return (
    <Card className="border border-gray-200/60 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md">
      <CardHeader className="pb-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Axolotl-OS
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Internal operating system for Axolotl Web Media
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@axolotlmedia.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                {...register('rememberMe')}
              />
              <span className="text-xs text-gray-600 select-none">Remember this device</span>
            </label>
          </div>

          {signIn.error && (
            <p className="text-xs text-red-650 bg-red-50 p-3 rounded-lg border border-red-200">
              {signIn.error.message || 'Invalid email or password'}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200"
            loading={signIn.isPending}
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Register now
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

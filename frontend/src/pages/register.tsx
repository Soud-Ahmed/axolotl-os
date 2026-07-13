import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSignUp } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import type { SignUpInput } from '../types/auth';

export function RegisterPage() {
  const signUp = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'client',
    }
  });

  const onSubmit = (data: any) => {
    signUp.mutate(data as SignUpInput);
  };

  return (
    <Card className="border border-gray-200/60 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md">
      <CardHeader className="pb-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Join Axolotl-OS organization workspace
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@axolotlmedia.com"
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
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Access Role</label>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              {...register('role')}
            >
              <option value="super_admin">Super Admin (Full access)</option>
              <option value="admin">Admin (Manage projects/clients, CRM)</option>
              <option value="client">Client (Access own projects, files, docs)</option>
            </select>
          </div>

          {signUp.error && (
            <p className="text-xs text-red-650 bg-red-50 p-3 rounded-lg border border-red-200">
              {signUp.error.message || 'Registration failed'}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200"
            loading={signUp.isPending}
          >
            Create Account
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

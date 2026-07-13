import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useResetPassword } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';

interface ResetPasswordFormInput {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>();

  const password = watch('password');

  const onSubmit = (data: ResetPasswordFormInput) => {
    resetPassword.mutate(data.password);
  };

  return (
    <Card className="border border-gray-200/60 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md">
      <CardHeader className="pb-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Enter your new password below
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Create new password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (val) => val === password || 'Passwords do not match',
            })}
          />

          {resetPassword.error && (
            <p className="text-xs text-red-650 bg-red-50 p-3 rounded-lg border border-red-200">
              {resetPassword.error.message || 'Password update failed'}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200"
            loading={resetPassword.isPending}
          >
            Update Password
          </Button>

          <p className="text-center text-xs text-gray-550 pt-2">
            Go back to{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

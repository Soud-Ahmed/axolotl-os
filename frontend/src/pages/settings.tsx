import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth';
import { useUpdateUserProfile } from '../hooks/use-users';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface SettingsFormInput {
  fullName: string;
  avatarUrl: string;
}

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateUserProfile();

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormInput>({
    defaultValues: {
      fullName: user?.fullName || user?.name || '',
      avatarUrl: user?.avatarUrl || '',
    }
  });

  const onSubmit = (data: SettingsFormInput) => {
    if (user) {
      updateProfile.mutate({
        id: user.id,
        data: {
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
        }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile details and view system configuration.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-150 py-4 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-800">Edit Profile Details</h3>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Name is required' })}
              />

              <Input
                label="Avatar URL"
                placeholder="https://example.com/avatar.jpg"
                error={errors.avatarUrl?.message}
                {...register('avatarUrl')}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  loading={updateProfile.isPending}
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* System Settings Status */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-150 py-4 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-800">System Information</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs text-gray-600 font-mono">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold">Backend Server Mode</span>
              <span className="text-blue-600 font-bold uppercase">Local JSON Fallback</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold">Supabase PostgreSQL Connection</span>
              <span className="text-yellow-600 font-bold uppercase">Disabled (Using disk storage)</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold">Upload Directory (Local server)</span>
              <span className="text-gray-800">backend/data/uploads</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Operating System Client version</span>
              <span className="text-gray-850">v1.2.0-stable</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

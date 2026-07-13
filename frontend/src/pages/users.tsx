import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { useAuthStore } from '../store/auth';
import { useUsers, useUpdateUserProfile } from '../hooks/use-users';
import { User, UserRole } from '../types';

export function UsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { data: users, isLoading, isError } = useUsers();
  const updateProfile = useUpdateUserProfile();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  const openEditRoleModal = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleRoleUpdate = () => {
    if (editingUser) {
      updateProfile.mutate({
        id: editingUser.id,
        data: { role: selectedRole }
      }, {
        onSuccess: () => {
          setEditingUser(null);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-semibold text-lg">Error loading users</h2>
        <p className="text-sm mt-1">Make sure the backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Team Members</h1>
        <p className="mt-1 text-sm text-gray-500">View team members and manage organization access roles.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 font-medium text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Member Since</th>
                  {currentUser?.role === 'super_admin' && (
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Avatar name={member.fullName || member.name} size="sm" className="bg-blue-600 text-white" />
                      <span className="font-semibold text-gray-900">{member.fullName || member.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xxs font-semibold uppercase tracking-wider ${
                        member.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : member.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role === 'super_admin' ? 'Super Admin' : member.role === 'admin' ? 'Admin' : 'Client'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    {currentUser?.role === 'super_admin' && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditRoleModal(member)}
                          className="text-blue-600 hover:text-blue-900 text-xs font-semibold"
                        >
                          Change Role
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Change Member Role</h2>
            <p className="text-xs text-gray-500">
              Select access permission role for <span className="font-semibold">{editingUser.fullName || editingUser.name}</span>.
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-semibold text-gray-700">Access Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="super_admin">Super Admin (Full Access)</option>
                <option value="admin">Admin (Manage Assigned Projects/Clients)</option>
                <option value="client">Client (Access own projects, files, docs)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="ghost" type="button" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleRoleUpdate}
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                loading={updateProfile.isPending}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

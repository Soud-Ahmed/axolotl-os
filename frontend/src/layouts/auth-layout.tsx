import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Axolotl-OS</h1>
          <p className="mt-2 text-sm text-gray-600">
            Internal operating system for Axolotl Web Media
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

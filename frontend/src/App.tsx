import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/root-layout';
import { AuthLayout } from './layouts/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout';
import { ProtectedRoute, RoleProtectedRoute } from './middleware/protected-route';
import { GuestRoute } from './middleware/guest-route';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ForgotPasswordPage } from './pages/forgot-password';
import { ResetPasswordPage } from './pages/reset-password';
import { VerifyEmailPage } from './pages/verify-email';
import { DashboardPage } from './pages/dashboard';
import { ContentPage } from './pages/content';
import { MediaPage } from './pages/media';
import { TasksPage } from './pages/tasks';
import { UsersPage } from './pages/users';
import { SettingsPage } from './pages/settings';
import { NotFoundPage } from './pages/not-found';
import { LandingPage } from './pages/landing';
import { ForbiddenPage } from './pages/forbidden';

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Forbidden Error Page */}
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Guest routes (Auth) - redirects authenticated users to /dashboard */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>
        </Route>

        {/* Private routes (OS Modules) - redirects guests to /login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            
            {/* Super Admin & Admin Only */}
            <Route element={<RoleProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>

            {/* Super Admin Only */}
            <Route element={<RoleProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

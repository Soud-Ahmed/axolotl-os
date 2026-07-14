import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RootLayout } from './layouts/root-layout';
import { AuthLayout } from './layouts/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout';
import { ProtectedRoute, RoleProtectedRoute } from './middleware/protected-route';
import { GuestRoute } from './middleware/guest-route';
import { Loader } from './components/ui/loader';

// Lazy-loaded pages for better performance and route transitions
const LoginPage = lazy(() => import('./pages/login').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/register').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/reset-password').then(module => ({ default: module.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/verify-email').then(module => ({ default: module.VerifyEmailPage })));
const DashboardPage = lazy(() => import('./pages/dashboard').then(module => ({ default: module.DashboardPage })));
const ContentPage = lazy(() => import('./pages/content').then(module => ({ default: module.ContentPage })));
const MediaPage = lazy(() => import('./pages/media').then(module => ({ default: module.MediaPage })));
const TasksPage = lazy(() => import('./pages/tasks').then(module => ({ default: module.TasksPage })));
const UsersPage = lazy(() => import('./pages/users').then(module => ({ default: module.UsersPage })));
const SettingsPage = lazy(() => import('./pages/settings').then(module => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import('./pages/not-found').then(module => ({ default: module.NotFoundPage })));
const LandingPage = lazy(() => import('./pages/landing').then(module => ({ default: module.LandingPage })));
const ForbiddenPage = lazy(() => import('./pages/forbidden').then(module => ({ default: module.ForbiddenPage })));

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // If the path changes, trigger the loader and wait 0.7s before actually rendering the new route
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 700); // 0.7s artificial delay

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation.pathname]);

  return (
    <>
      {isTransitioning && <Loader />}
      <Suspense fallback={<Loader />}>
        {/* Pass the frozen displayLocation so the old page stays visible underneath the loader until the delay is over */}
        <Routes location={displayLocation}>
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
      </Suspense>
    </>
  );
}

export default App;

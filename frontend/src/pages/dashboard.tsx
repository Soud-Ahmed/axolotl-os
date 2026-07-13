import { useAuthStore } from '../store/auth';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { useMetrics } from '../hooks/use-analytics';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: metrics, isLoading, isError } = useMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-semibold text-lg">Error loading metrics</h2>
        <p className="text-sm mt-1">Failed to communicate with Axolotl-OS server. Make sure the backend server is running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">System Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, <span className="font-semibold text-blue-600">{user?.fullName || user?.name || user?.email}</span>. Here is the operational status for Axolotl Web Media.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Articles</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{metrics.totalArticles}</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {metrics.publishedArticles} Published
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending Review</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{metrics.pendingReviews}</span>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Tasks</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{metrics.totalTasks - metrics.completedTasks}</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {metrics.completedTasks} Completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Media Assets</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{metrics.totalAssets}</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Stored Files
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SVG Chart Card */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-700">Web Analytics Trend (7 Days Views)</h3>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-end">
            <div className="relative h-44 w-full">
              {/* SVG Line Chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f3f4f6" strokeWidth={1} />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f3f4f6" strokeWidth={1} />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f3f4f6" strokeWidth={1} />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#e5e7eb" strokeWidth={1.5} />
                
                {/* Line Path */}
                <path
                  d="M 10 120 L 100 100 L 200 110 L 300 80 L 400 50 L 500 30 L 590 10"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                
                {/* Area Fill */}
                <path
                  d="M 10 120 L 100 100 L 200 110 L 300 80 L 400 50 L 500 30 L 590 10 L 590 160 L 10 160 Z"
                  fill="url(#chartGrad)"
                />

                {/* Points */}
                <circle cx={10} cy={120} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={100} cy={100} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={200} cy={110} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={300} cy={80} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={400} cy={50} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={500} cy={30} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={590} cy={10} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
              </svg>
            </div>
            
            {/* Legend / Labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-4 font-mono px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-700">Recent Logs</h3>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto pr-2">
            <div className="space-y-4">
              {metrics.recentActivity.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-8">
                  No system logs registered.
                </div>
              ) : (
                metrics.recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-3 text-xs border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <Avatar name={log.userName} size="sm" className="bg-gray-100 text-gray-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800">
                        <span className="font-medium text-gray-900">{log.userName}</span> ({log.userRole}): {log.action}
                      </p>
                      <p className="text-xxs text-gray-400 mt-0.5 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

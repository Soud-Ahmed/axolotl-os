import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Sun, Moon, Menu, X, ChevronDown, 
  Settings, LogOut, Info, FileText, CheckCircle,
  LayoutDashboard, FileSpreadsheet, Image, CheckSquare, 
  Users, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUiStore } from '../store/ui';
import { useSignOut } from '../hooks/use-auth';
import { Avatar } from '../components/ui/avatar';
import { useMediaQuery } from '../hooks/use-media-query';
import { cn } from '../lib/utils';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Documentation', href: '/content', icon: FileSpreadsheet },
  { label: 'Files & Media', href: '/media', icon: Image },
  { label: 'Projects & Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'CRM & Team', href: '/users', icon: Users, roles: ['super_admin', 'admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['super_admin'] },
];

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUiStore();
  const signOut = useSignOut();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const location = useLocation();

  // Local state for interactive dropdowns
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Project status updated', desc: 'SaaS Platform shifted to active status.', time: '5m ago', icon: Info, color: 'text-blue-500 bg-blue-50' },
    { id: 2, title: 'Task assigned to you', desc: 'Write documentation for the database schema.', time: '1h ago', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    { id: 3, title: 'System Notification', desc: 'Row Level Security activated successfully.', time: '2h ago', icon: FileText, color: 'text-purple-500 bg-purple-50' },
  ]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setProfileDropdownOpen(false);
      setNotificationsOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter links by user role
  const filteredLinks = sidebarLinks.filter(
    (link) => !link.roles || (user?.role && link.roles.includes(user.role))
  );

  return (
    <div className={cn("flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300", theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900')}>
      
      {/* 1. Sidebar (Responsive Desktop Collapsible / Mobile Sliding) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isDesktop ? (sidebarCollapsed ? 80 : 256) : (sidebarOpen ? 256 : 0),
          x: isDesktop ? 0 : (sidebarOpen ? 0 : -256)
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-colors duration-300 lg:static lg:translate-x-0",
          theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'
        )}
      >
        {/* Brand Logo & Collapse Trigger */}
        <div className={cn("flex h-16 items-center justify-between px-6 border-b transition-colors duration-300", theme === 'dark' ? 'border-gray-800 bg-gray-950/20' : 'border-gray-150 bg-blue-50/20')}>
          <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20">
              AX
            </div>
            {!sidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-md font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Axolotl-OS
              </motion.span>
            )}
          </Link>
          
          {isDesktop ? (
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn("hidden lg:flex h-6 w-6 items-center justify-center rounded-md border transition-colors", 
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'
              )}
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform duration-250", !sidebarCollapsed && "rotate-180")} />
            </button>
          ) : (
            <button onClick={toggleSidebar} className="lg:hidden">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation Sidebar Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-400 shadow-inner' : 'bg-blue-50 text-blue-600 font-semibold')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 hover:scale-105", isActive && "text-blue-500")} />
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {link.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area: User Card */}
        <div className={cn("border-t p-4 transition-colors duration-300", theme === 'dark' ? 'border-gray-800 bg-gray-950/20' : 'border-gray-150 bg-gray-50/50')}>
          <div className="flex items-center gap-3.5">
            <Avatar name={user?.fullName || user?.name || 'User'} size="sm" className="bg-blue-600 text-white shrink-0 shadow-sm" />
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 truncate">
                <p className="text-sm font-semibold truncate">{user?.fullName || user?.name || 'User'}</p>
                <span className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0.5 text-xxs font-medium uppercase tracking-wide",
                  user?.role === 'super_admin' ? 'bg-purple-100/80 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 
                  user?.role === 'admin' ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 
                  'bg-green-100/80 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                )}>
                  {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Client'}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && !isDesktop && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden" onClick={toggleSidebar} />
      )}

      {/* 2. Main content container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between px-6 border-b transition-colors duration-300 backdrop-blur-md bg-opacity-70",
          theme === 'dark' ? 'bg-gray-950/70 border-gray-800' : 'bg-white/70 border-gray-200'
        )}>
          {/* Collapse sidebar switch on mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className={cn("rounded-lg p-2 transition-colors lg:hidden", 
                theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Premium Command-K style search button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className={cn("flex items-center gap-2.5 rounded-full px-4 py-2 border text-left text-xs transition-all duration-200 w-48 sm:w-64 font-medium",
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/80' 
                  : 'bg-gray-100 border-gray-250 text-gray-500 hover:border-gray-300 hover:bg-gray-100/85'
              )}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search workspace...</span>
              <span className={cn("ml-auto border rounded px-1.5 py-0.5 text-xxs font-semibold",
                theme === 'dark' ? 'border-gray-750 bg-gray-950' : 'border-gray-350 bg-white'
              )}>⌘K</span>
            </button>
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-3.5">
            <span className="text-xxs text-gray-400 font-mono hidden md:inline bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-full">
              Local Mode Fallback Enabled
            </span>

            {/* A. Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={cn("relative rounded-lg p-2 border transition-all duration-250 hover:scale-105",
                theme === 'dark' ? 'border-gray-800 bg-gray-900 hover:bg-gray-800 text-yellow-400' : 'border-gray-200 bg-white hover:bg-gray-50 text-blue-600'
              )}
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* B. Notifications Bell */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={cn("relative rounded-lg p-2 border transition-all duration-250 hover:scale-105",
                  theme === 'dark' ? 'border-gray-800 bg-gray-900 hover:bg-gray-800 text-gray-300' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600',
                  notificationsOpen && 'border-blue-500 ring-2 ring-blue-500/10'
                )}
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn("absolute right-0 mt-3 w-80 rounded-2xl border shadow-xl p-4 space-y-3 z-50",
                      theme === 'dark' ? 'bg-gray-900 border-gray-850' : 'bg-white border-gray-200'
                    )}
                  >
                    <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</h4>
                      <button 
                        onClick={() => setNotifications([])} 
                        className="text-xxs font-bold text-blue-500 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-4">No new alerts.</p>
                    ) : (
                      <div className="space-y-3.5 max-h-60 overflow-y-auto">
                        {notifications.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.id} className="flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 p-1.5 rounded-lg transition-colors duration-150">
                              <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", item.color)}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                                <p className="text-xxs text-gray-500 truncate">{item.desc}</p>
                                <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* C. Interactive Profile Dropdown Card */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={cn("flex items-center gap-1.5 rounded-full p-1 border transition-all duration-250",
                  theme === 'dark' 
                    ? 'border-gray-850 hover:border-gray-700 bg-gray-900/50' 
                    : 'border-gray-250 hover:border-gray-300 bg-gray-50/50',
                  profileDropdownOpen && 'border-blue-500 ring-2 ring-blue-500/10'
                )}
              >
                <Avatar name={user?.fullName || user?.name || 'User'} size="sm" className="bg-blue-600 text-white shrink-0" />
                <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform duration-200", profileDropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn("absolute right-0 mt-3 w-64 rounded-2xl border shadow-xl p-4 z-50 space-y-4",
                      theme === 'dark' ? 'bg-gray-900 border-gray-850' : 'bg-white border-gray-200'
                    )}
                  >
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-3 border-b pb-3 dark:border-gray-800">
                      <Avatar name={user?.fullName || user?.name || 'User'} size="sm" className="bg-blue-600 text-white" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{user?.fullName || user?.name}</p>
                        <p className="text-xxs text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>

                    {/* Actions List */}
                    <div className="space-y-1.5">
                      <Link 
                        to="/settings" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className={cn("flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                          theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                        Settings
                      </Link>
                      <button 
                        onClick={() => signOut.mutate()}
                        className={cn("flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold w-full text-left transition-colors text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20")}
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. Main content scroll container */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* 4. Workspace Search Modal overlay (Cmd-K dialog) */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className={cn("w-full max-w-lg rounded-2xl border shadow-2xl p-5 space-y-4",
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
                <div className="flex items-center gap-2.5 text-gray-400 flex-1">
                  <Search className="h-4 w-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search workspace (e.g. databases, wiki)..."
                    className="bg-transparent border-0 outline-none text-xs w-full focus:ring-0 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                </div>
                <button onClick={() => setSearchOpen(false)} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-4.5 w-4.5 text-gray-400" />
                </button>
              </div>

              {/* Mock Search Results list */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Quick Links</h5>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {filteredLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setSearchOpen(false)}
                        className={cn("flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-xs transition-colors",
                          theme === 'dark' ? 'hover:bg-gray-800/80' : 'hover:bg-gray-50'
                        )}
                      >
                        <Icon className="h-4.5 w-4.5 text-gray-400" />
                        <span className="font-medium">{link.label}</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-gray-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

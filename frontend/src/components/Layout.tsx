import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { cn, getInitials } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProjectFlow</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-primary-700">
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            to="/profile"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 text-gray-600" />
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

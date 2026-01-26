import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@/services/auth';
import { cn } from '@/lib/utils';
// Icons commented out for safety
// import { LayoutDashboard, Image, MessageSquare, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', iconStr: '📊' },
    { href: '/admin/media', label: 'Media Manager', iconStr: '🖼️' },
    { href: '/admin/inquiries', label: 'Inquiries', iconStr: '💬' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          {/* Logo placeholder */}
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">SP</div>
          <h1 className="text-xl font-bold font-serif">Sanwaliya Admin</h1>
        </div>
        <p className="text-sm text-muted-foreground">Welcome, {user?.name || 'Admin'}</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <span className="text-lg">{item.iconStr}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
          <span className="text-lg">🚪</span>
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b flex items-center px-4 lg:hidden sticky top-0 z-30 justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="font-semibold">Admin Panel</span>
          <div className="w-8" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

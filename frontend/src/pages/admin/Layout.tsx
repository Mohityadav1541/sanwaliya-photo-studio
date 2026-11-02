import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/services/auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut, ExternalLink, Sparkles } from "lucide-react";

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
    navigate("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/media", label: "Media & 3D Manager", icon: ImageIcon },
    { href: "/admin/inquiries", label: "Client Inquiries", icon: MessageSquare },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FAF8F5] border-r border-[#181817]/10 backdrop-blur-xl text-[#181817] font-sans">
      {/* Brand & Studio Status */}
      <div className="p-6 border-b border-[#181817]/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#181817] text-white flex items-center justify-center text-xs font-serif font-semibold shadow-md">
            SP
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-serif font-medium tracking-wide text-[#181817]">
              Sanwaliya Studio
            </h1>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D9381E] font-mono font-semibold">
              Admin &middot; 3D Engine
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 text-xs text-[#6E6A63]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Logged in as {user?.name || "Roshan Lal Yadav"}</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-300",
                isActive
                  ? "bg-[#181817] text-white font-semibold shadow-md"
                  : "text-[#6E6A63] hover:text-[#181817] hover:bg-[#EFECE6]/60 border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-[#C5A880]" : "text-[#6E6A63]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[#181817]/10">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-[#6E6A63] hover:text-[#181817] hover:bg-[#EFECE6]/60 transition-all font-mono"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>Live User Page</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#181817]/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs uppercase tracking-wider font-mono"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Admin</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] flex selection:bg-[#D9381E] selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#FAF8F5] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-lg",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-[#FAF8F5]/90 border-b border-[#181817]/10 backdrop-blur-md flex items-center px-4 lg:hidden sticky top-0 z-30 justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-[#181817]"
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="font-serif text-lg tracking-wide text-[#181817]">Sanwaliya Admin</span>
          <div className="w-8" />
        </header>

        {/* Dashboard Pages */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

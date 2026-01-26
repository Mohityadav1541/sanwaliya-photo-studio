import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout } from '@/services/auth';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl">Sanwaliya Admin Debug</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</Link>
            <Link to="/admin/media" className="block p-2 hover:bg-gray-100 rounded">Media Manager</Link>
            <Link to="/admin/inquiries" className="block p-2 hover:bg-gray-100 rounded">Inquiries</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

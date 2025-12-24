<<<<<<< HEAD
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userStr || '{}');
    } catch {
        localStorage.clear();
        return <Navigate to="/admin/login" replace />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
=======
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/services/auth';

const ProtectedRoute = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
>>>>>>> 72cceddb95ed801190bc58263c1cf06ccdd7da3e
};

export default ProtectedRoute;

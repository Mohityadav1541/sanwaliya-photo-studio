import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Parse user data
    let user;
    try {
        user = JSON.parse(userStr || '{}');
    } catch {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    // Admin-only route but user is not admin
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/customer/orders" replace />;
    }

    // Customer trying to access admin route
    if (user.role === 'CUSTOMER' && window.location.pathname.startsWith('/admin')) {
        return <Navigate to="/customer/orders" replace />;
    }

    return children;
}

export default ProtectedRoute;

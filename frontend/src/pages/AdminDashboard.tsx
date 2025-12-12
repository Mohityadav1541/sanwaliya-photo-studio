import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: string;
    createdAt: string;
}

interface Order {
    id: string;
    userId: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    items: any[];
}

const AdminDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        try {
            if (activeTab === 'orders') {
                const response = await fetch(`${apiUrl}/api/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setOrders(data);
            } else if (activeTab === 'users') {
                const response = await fetch(`${apiUrl}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-user-info">
                    <span>Welcome, {user.name}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'orders' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
                <button
                    className={activeTab === 'users' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
            </div>

            <div className="admin-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'orders' && (
                            <div className="orders-section">
                                <h2>All Orders ({orders.length})</h2>
                                <div className="orders-grid">
                                    {orders.map(order => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <span className="order-id">#{order.id.slice(-6)}</span>
                                                <span className={`order-status ${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-details">
                                                <p><strong>Customer:</strong> {order.user.name}</p>
                                                <p><strong>Email:</strong> {order.user.email}</p>
                                                <p><strong>Items:</strong> {order.items.length}</p>
                                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="users-section">
                                <h2>All Users ({users.length})</h2>
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone || 'N/A'}</td>
                                                <td>
                                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

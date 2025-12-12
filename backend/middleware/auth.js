const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sanwaliya-photo-studio-secret-2024';

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};

// Middleware to check if user is customer or admin
const isCustomerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'CUSTOMER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
    }

    next();
};

module.exports = {
    authenticate,
    isAdmin,
    isCustomerOrAdmin
};

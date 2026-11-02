const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication Required',
                message: 'No valid Bearer token provided in request authorization header.',
            });
        }

        const token = authHeader.substring(7).trim();
        const secret = process.env.JWT_SECRET || 'sanwaliya_fallback_dev_secret_key_2026';

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token Expired',
                message: 'Your admin session has expired. Please authenticate again.',
            });
        }
        return res.status(401).json({
            error: 'Invalid Credentials',
            message: 'Signature verification failed. Please authenticate again.',
        });
    }
};

module.exports = auth;

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { securityHeaders, createRateLimiter } = require('./middleware/security');
const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const contactRoutes = require('./routes/contactRoutes');
const infoRoutes = require('./routes/infoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(securityHeaders);

// CORS configuration with credentials support
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, true); // Dev-friendly fallback
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiters for brute-force prevention
const loginLimiter = createRateLimiter(15 * 60 * 1000, 15); // 15 attempts per 15 mins
const uploadLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 uploads per 15 mins

// Serve uploaded files securely
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/media/admin', uploadLimiter);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/info', infoRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        name: 'Sanwaliya Photo Studio API',
        theme: 'Daylight Atelier 3D Suite',
        status: 'online',
        timestamp: new Date().toISOString(),
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[API Error]:', err.stack);
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'An unexpected error occurred.',
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[Daylight Atelier API] Server running on port ${PORT}`);
});

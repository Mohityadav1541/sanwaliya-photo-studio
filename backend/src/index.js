const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const contactRoutes = require('./routes/contactRoutes');
const infoRoutes = require('./routes/infoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/info', infoRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Sanwaliya Photo Studio API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

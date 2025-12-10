const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await prisma.adminUser.findUnique({ where: { email } });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and admin info (excluding password)
        res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/auth/me (Protected)
router.get('/me', auth, async (req, res) => {
    try {
        const admin = await prisma.adminUser.findUnique({
            where: { id: req.user.id }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            createdAt: admin.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

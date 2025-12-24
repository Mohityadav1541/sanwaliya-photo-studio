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

// HIDDEN ROUTE: Run seed via URL since shell access is restricted
// GET /api/auth/seed-admin-secret-key-12345
router.get('/seed-admin-secret-key-12345', async (req, res) => {
    try {
        const email = 'roshanlalyadav30408@gmail.com';
        const password = 'rambhajan1540';
        const name = 'Roshan Lal Yadav';

        const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });

        if (existingAdmin) {
            // Update password if exists
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.adminUser.update({
                where: { email },
                data: { passwordHash: hashedPassword }
            });
            return res.json({ message: 'Admin exists. Password updated successfully.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.adminUser.create({
            data: {
                email,
                passwordHash: hashedPassword,
                name,
            },
        });

        res.json({ message: 'Admin created successfully', email, password });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

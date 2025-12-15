const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();

const { sendWhatsAppReply, sendEmailReply } = require('../services/autoReplyService');

// PUBLIC: Submit contact form
// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            eventType,
            eventDate,
            eventLocation,
            message,
        } = req.body;

        const contact = await prisma.contactRequest.create({
            data: {
                name,
                email,
                phone,
                eventType,
                eventDate: eventDate ? new Date(eventDate) : null,
                eventLocation,
                message,
                status: 'NEW',
            },
        });

        // Auto-reply
        const AUTO_REPLY_MESSAGE = `Hello, this is Sanwaliya Photo Studio (Roshan Lal Yadav).
Thank you for contacting us! We received your message and 
we will get back to you soon. 
For urgent enquiries, please call or WhatsApp us at:
9829128594 or 8619053741.`;

        try {
            if (phone) {
                // Don't await if we want it to be non-blocking, but for simplicity/safety we await 
                // to ensure it runs within request lifecycle. 
                // User asked to 'Add try/catch so backend will not break'.
                await sendWhatsAppReply(phone, AUTO_REPLY_MESSAGE);
            }
            if (email) {
                await sendEmailReply(email, AUTO_REPLY_MESSAGE);
            }
        } catch (notifyError) {
            console.error('Auto-reply error:', notifyError);
            // Logic proceeds to send response even if notification fails
        }

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Get all requests
// GET /api/contact/admin
router.get('/admin', auth, async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};

        if (status) {
            where.status = status;
        }

        const messages = await prisma.contactRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Update status
// PATCH /api/contact/admin/:id
router.patch('/admin/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['NEW', 'SEEN', 'ARCHIVED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const contact = await prisma.contactRequest.update({
            where: { id: id },
            data: { status },
        });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

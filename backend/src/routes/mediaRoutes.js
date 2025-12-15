const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// --- Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP and MP4 are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// --- Helper Functions ---
const deleteFile = (filePath) => {
    if (!filePath) return;
    const absolutePath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// --- PUBLIC ROUTES ---

// GET /api/media - List with filters and pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { category, type, featured } = req.query;

        const where = {};
        if (category) where.category = category;
        if (type) where.type = type;
        if (featured === 'true') where.isFeatured = true;

        const [items, total] = await prisma.$transaction([
            prisma.mediaItem.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.mediaItem.count({ where }),
        ]);

        res.json({
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/media/:id - Get single item
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const media = await prisma.mediaItem.findUnique({
            where: { id: id },
        });

        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN ROUTES ---

// POST /api/media/admin - Create new media
router.post('/admin', auth, upload.single('file'), async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            type,
            externalUrl,
            eventDate,
            location,
            isFeatured,
        } = req.body;

        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        // Validation: Require either fileUrl or externalUrl
        if (!fileUrl && !externalUrl) {
            return res.status(400).json({ error: 'Either file or externalUrl is required' });
        }

        const media = await prisma.mediaItem.create({
            data: {
                title: title || 'Untitled',
                description,
                category,
                type: type || 'IMAGE',
                fileUrl,
                externalUrl,
                eventDate: eventDate ? new Date(eventDate) : null,
                location,
                isFeatured: isFeatured === 'true',
            },
        });

        res.status(201).json(media);
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) deleteFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/media/admin/:id - Update media
router.put('/admin/:id', auth, upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            category,
            type,
            externalUrl,
            eventDate,
            location,
            isFeatured,
        } = req.body;

        const existingMedia = await prisma.mediaItem.findUnique({
            where: { id: id },
        });

        if (!existingMedia) {
            // Clean up if new file was uploaded but record not found
            if (req.file) deleteFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({ error: 'Media not found' });
        }

        let fileUrl = existingMedia.fileUrl;

        // If new file uploaded, delete old one and update url
        if (req.file) {
            if (existingMedia.fileUrl) {
                deleteFile(existingMedia.fileUrl);
            }
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const updatedMedia = await prisma.mediaItem.update({
            where: { id: id },
            data: {
                title,
                description,
                category,
                type,
                fileUrl,
                externalUrl,
                eventDate: eventDate ? new Date(eventDate) : existingMedia.eventDate,
                location,
                isFeatured: isFeatured !== undefined ? isFeatured === 'true' : existingMedia.isFeatured,
            },
        });

        res.json(updatedMedia);
    } catch (error) {
        if (req.file) deleteFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/media/admin/:id - Delete media
router.delete('/admin/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const media = await prisma.mediaItem.findUnique({
            where: { id: id },
        });

        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        // Delete physical file
        if (media.fileUrl) {
            deleteFile(media.fileUrl);
        }

        // Delete db record
        await prisma.mediaItem.delete({
            where: { id: id },
        });

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');
const auth = require('../middleware/auth');
const {
    validateMagicBytes,
    stripGpsExif,
    sanitizeString,
} = require('../middleware/security');

const router = express.Router();

// --- Configuration with Sanitized Filenames ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Sanitize original extension and create unguessable collision-free filename
        const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
        const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'].includes(ext) ? ext : '.jpg';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `atelier-${uniqueSuffix}${safeExt}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid MIME header. Only JPG, PNG, WEBP and MP4 are permitted.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// Helper for file cleanup
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

// GET /api/media - List with filters, pagination and sorting
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { category, type, featured } = req.query;

        const where = {};
        if (category && category !== 'All') where.category = category;
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
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/media/:id - Fetch single media record
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const media = await prisma.mediaItem.findUnique({
            where: { id },
        });

        if (!media) {
            return res.status(404).json({ error: 'Media asset not found' });
        }

        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN SECURE CRUD ROUTES ---

// POST /api/media/admin - Create new media with magic-byte validation & GPS stripping
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
            frameFinish,
            matteBorder,
        } = req.body;

        let fileUrl = null;

        if (req.file) {
            const absoluteFilePath = req.file.path;

            // Security Hardening: Magic-Byte MIME Validation
            const isValidBytes = validateMagicBytes(absoluteFilePath);
            if (!isValidBytes) {
                deleteFile(`/uploads/${req.file.filename}`);
                return res.status(400).json({
                    error: 'Security verification failed: File contents do not match genuine image/video magic bytes.',
                });
            }

            // Privacy Hardening: Strip sensitive GPS metadata
            stripGpsExif(absoluteFilePath);

            fileUrl = `/uploads/${req.file.filename}`;
        }

        if (!fileUrl && !externalUrl) {
            return res.status(400).json({ error: 'Either file or externalUrl is required' });
        }

        // Input Sanitization to prevent stored XSS attacks
        const cleanTitle = sanitizeString(title) || 'Untitled Frame';
        const cleanDescription = sanitizeString(description) || '';
        const cleanLocation = sanitizeString(location) || 'Rajasthan, India';

        const media = await prisma.mediaItem.create({
            data: {
                title: cleanTitle,
                description: cleanDescription,
                category: category || 'Weddings',
                type: type || 'IMAGE',
                fileUrl,
                externalUrl: externalUrl ? sanitizeString(externalUrl) : null,
                eventDate: eventDate ? new Date(eventDate) : null,
                location: cleanLocation,
                isFeatured: isFeatured === 'true',
            },
        });

        res.status(201).json(media);
    } catch (error) {
        if (req.file) deleteFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/media/admin/:id - Update media record
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
            where: { id },
        });

        if (!existingMedia) {
            if (req.file) deleteFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({ error: 'Media not found' });
        }

        let fileUrl = existingMedia.fileUrl;

        if (req.file) {
            const absoluteFilePath = req.file.path;
            const isValidBytes = validateMagicBytes(absoluteFilePath);
            if (!isValidBytes) {
                deleteFile(`/uploads/${req.file.filename}`);
                return res.status(400).json({
                    error: 'Security verification failed: Corrupted or forged file header.',
                });
            }

            stripGpsExif(absoluteFilePath);

            // Delete old file if replacing
            if (existingMedia.fileUrl) {
                deleteFile(existingMedia.fileUrl);
            }
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const updated = await prisma.mediaItem.update({
            where: { id },
            data: {
                title: title ? sanitizeString(title) : existingMedia.title,
                description: description !== undefined ? sanitizeString(description) : existingMedia.description,
                category: category || existingMedia.category,
                type: type || existingMedia.type,
                fileUrl,
                externalUrl: externalUrl ? sanitizeString(externalUrl) : existingMedia.externalUrl,
                eventDate: eventDate ? new Date(eventDate) : existingMedia.eventDate,
                location: location ? sanitizeString(location) : existingMedia.location,
                isFeatured: isFeatured !== undefined ? isFeatured === 'true' : existingMedia.isFeatured,
            },
        });

        res.json(updated);
    } catch (error) {
        if (req.file) deleteFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/media/admin/:id - Delete media record
router.delete('/admin/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const media = await prisma.mediaItem.findUnique({
            where: { id },
        });

        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        // Delete physical file on disk
        if (media.fileUrl) {
            deleteFile(media.fileUrl);
        }

        await prisma.mediaItem.delete({
            where: { id },
        });

        res.json({ message: 'Media deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

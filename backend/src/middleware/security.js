/**
 * Security Middleware - Headers, Magic Byte Validation & Input Sanitization
 */

const fs = require('fs');

// Security headers middleware
const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
    );
    next();
};

// Simple In-Memory Rate Limiter
const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    const hits = new Map();

    // Clean up expired buckets periodically
    setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of hits.entries()) {
            if (now - record.startTime > windowMs) {
                hits.delete(ip);
            }
        }
    }, windowMs);

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const record = hits.get(ip) || { count: 0, startTime: now };

        if (now - record.startTime > windowMs) {
            record.count = 1;
            record.startTime = now;
        } else {
            record.count += 1;
        }

        hits.set(ip, record);

        if (record.count > maxRequests) {
            return res.status(429).json({
                error: 'Too many requests. Please wait a few moments before trying again.',
            });
        }

        next();
    };
};

// Validate File Magic Bytes (True MIME detection beyond file extensions)
const validateMagicBytes = (filePath) => {
    if (!fs.existsSync(filePath)) return false;

    const buffer = Buffer.alloc(12);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return true;
    }

    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        return true;
    }

    // WebP: RIFF ... WEBP
    if (
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
    ) {
        return true;
    }

    // MP4: ftyp
    if (
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70
    ) {
        return true;
    }

    return false;
};

// Strip sensitive GPS EXIF markers from JPEG on disk
const stripGpsExif = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return;
        const buffer = fs.readFileSync(filePath);

        // Check JPEG header
        if (buffer[0] === 0xff && buffer[1] === 0xd8) {
            let offset = 2;
            while (offset < buffer.length - 4) {
                if (buffer[offset] !== 0xff) break;
                const marker = buffer[offset + 1];

                if (marker === 0xe1) {
                    // APP1 marker
                    const app1Length = buffer.readUInt16BE(offset + 2);
                    const end = Math.min(offset + 2 + app1Length, buffer.length);
                    // Search for 'GPS ' or GPS tag block and zero it out
                    for (let i = offset + 4; i < end - 4; i++) {
                        if (
                            buffer[i] === 0x47 && // G
                            buffer[i + 1] === 0x50 && // P
                            buffer[i + 2] === 0x53 // S
                        ) {
                            buffer.fill(0, i, Math.min(i + 32, end));
                        }
                    }
                }
                if (marker === 0xda || marker === 0xd9) break;
                const segLength = buffer.readUInt16BE(offset + 2);
                offset += 2 + segLength;
            }
            fs.writeFileSync(filePath, buffer);
        }
    } catch (e) {
        console.warn('[Security] GPS stripping warning:', e.message);
    }
};

// String Sanitizer against XSS
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
};

module.exports = {
    securityHeaders,
    createRateLimiter,
    validateMagicBytes,
    stripGpsExif,
    sanitizeString,
};


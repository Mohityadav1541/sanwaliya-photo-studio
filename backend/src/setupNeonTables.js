const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function setupNeon() {
    console.log('Connecting to Neon PostgreSQL database...');

    const client = new Client({
        host: '3.147.219.177',
        port: 5432,
        user: 'neondb_owner',
        password: 'npg_Kw4qVe8nDZHc',
        database: 'neondb',
        ssl: {
            rejectUnauthorized: false,
            servername: 'ep-red-sun-be4d00lo.c-9.us-east-2.aws.neon.tech',
        },
    });

    try {
        await client.connect();
        console.log('✔ Connected to Neon PostgreSQL!');

        // 1. Create Tables
        console.log('Creating database tables...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS "AdminUser" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT,
                "email" TEXT UNIQUE NOT NULL,
                "passwordHash" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "MediaItem" (
                "id" TEXT PRIMARY KEY,
                "title" TEXT NOT NULL,
                "description" TEXT,
                "category" TEXT,
                "type" TEXT NOT NULL DEFAULT 'IMAGE',
                "fileUrl" TEXT,
                "externalUrl" TEXT,
                "thumbnailUrl" TEXT,
                "eventDate" TIMESTAMP(3),
                "location" TEXT,
                "isFeatured" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "ContactRequest" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT NOT NULL,
                "phone" TEXT,
                "email" TEXT NOT NULL,
                "eventType" TEXT,
                "eventDate" TIMESTAMP(3),
                "eventLocation" TEXT,
                "message" TEXT NOT NULL,
                "status" TEXT NOT NULL DEFAULT 'NEW',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✔ Tables "AdminUser", "MediaItem", "ContactRequest" created successfully!');

        // 2. Seed Admin User
        const adminEmail = 'roshanlalyadav30408@gmail.com';
        const adminPassword = 'rambhajan1540';
        const adminName = 'Roshan Lal Yadav';

        const existingAdmin = await client.query(
            'SELECT id FROM "AdminUser" WHERE email = $1',
            [adminEmail]
        );

        if (existingAdmin.rows.length === 0) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            const adminId = 'admin-' + Date.now();
            await client.query(
                'INSERT INTO "AdminUser" (id, name, email, "passwordHash") VALUES ($1, $2, $3, $4)',
                [adminId, adminName, adminEmail, passwordHash]
            );
            console.log(`✔ Admin user created: ${adminEmail}`);
        } else {
            console.log(`ℹ Admin user already exists: ${adminEmail}`);
        }

        // 3. Seed initial Daylight Atelier sample items
        const countRes = await client.query('SELECT COUNT(*) FROM "MediaItem"');
        const count = parseInt(countRes.rows[0].count, 10);

        if (count === 0) {
            console.log('Seeding initial Daylight Atelier portfolio collection...');
            const sampleItems = [
                {
                    id: 'media-1',
                    title: 'Eternal Vows at Sunset',
                    category: 'Weddings',
                    description: 'Captured amidst the amber glow of the Lake Palace. Natural warmth and timeless royal composition.',
                    location: 'Udaipur, Rajasthan',
                    fileUrl: '/uploads/hero-wedding.jpg',
                    isFeatured: true,
                },
                {
                    id: 'media-2',
                    title: 'The Golden Ghunghat',
                    category: 'Weddings',
                    description: 'Subtle play of light through traditional zari embroidery, highlighting unposed bridal introspection.',
                    location: 'Jaipur, Rajasthan',
                    fileUrl: '/uploads/portfolio-wedding.jpg',
                    isFeatured: true,
                },
                {
                    id: 'media-3',
                    title: 'Echoes of the Aravalli',
                    category: 'Pre-Wedding',
                    description: 'Dramatic mist descending upon ancient bastion walls, casting high-contrast architectural silhouettes.',
                    location: 'Kumbhalgarh Fort',
                    fileUrl: '/uploads/portfolio-prewedding.jpg',
                    isFeatured: true,
                },
            ];

            for (const item of sampleItems) {
                await client.query(
                    `INSERT INTO "MediaItem" (id, title, category, description, location, "fileUrl", "isFeatured")
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [item.id, item.title, item.category, item.description, item.location, item.fileUrl, item.isFeatured]
                );
            }
            console.log('✔ Initial portfolio items seeded successfully!');
        } else {
            console.log(`ℹ Media table contains ${count} items.`);
        }

        console.log('\n=========================================');
        console.log('🎉 NEON DATABASE SETUP COMPLETE!');
        console.log('=========================================');
    } catch (err) {
        console.error('❌ Setup error:', err);
    } finally {
        await client.end();
    }
}

setupNeon();

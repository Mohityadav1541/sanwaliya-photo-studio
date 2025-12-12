const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const sqliteDbPath = path.resolve(__dirname, '../prisma/dev.db');

async function migrate() {
    console.log('Starting migration...');
    const db = new Database(sqliteDbPath, { readonly: true });

    // 1. Users
    // Check if table exists (in case it wasn't seeded)
    try {
        const users = db.prepare('SELECT * FROM User').all();
        console.log(`Migrating ${users.length} users...`);
        for (const u of users) {
            // Upsert based on legacyId or email
            await prisma.user.upsert({
                where: { email: u.email },
                update: { legacyId: u.id },
                create: {
                    legacyId: u.id,
                    email: u.email,
                    name: u.name
                }
            });
        }
    } catch (e) {
        console.error('Error migrating users:', e.message);
    }

    // 2. Categories
    try {
        const categories = db.prepare('SELECT * FROM Category').all();
        console.log(`Migrating ${categories.length} categories...`);
        for (const c of categories) {
            // We assume name is unique for demo or just create
            // Since we don't have unique constraint on name in schema (only legacyId which is unique), 
            // we can find by legacyId checks.
            const exists = await prisma.category.findUnique({ where: { legacyId: c.id } });
            if (!exists) {
                await prisma.category.create({
                    data: {
                        legacyId: c.id,
                        name: c.name
                    }
                });
            }
        }
    } catch (e) {
        console.error('Error migrating categories:', e.message);
    }

    // 3. Items
    try {
        const items = db.prepare('SELECT * FROM Item').all();
        console.log(`Migrating ${items.length} items...`);
        for (const i of items) {
            const exists = await prisma.item.findUnique({ where: { legacyId: i.id } });
            if (exists) continue;

            // Find mongo category id
            const category = await prisma.category.findUnique({ where: { legacyId: i.categoryId } });
            if (!category) {
                console.warn(`Category ${i.categoryId} not found for item ${i.id}`);
                continue;
            }
            await prisma.item.create({
                data: {
                    legacyId: i.id,
                    name: i.name,
                    price: i.price,
                    categoryId: category.id
                }
            });
        }
    } catch (e) {
        console.error('Error migrating items:', e.message);
    }

    // 4. Orders
    try {
        const orders = db.prepare('SELECT * FROM "Order"').all();
        console.log(`Migrating ${orders.length} orders...`);
        for (const o of orders) {
            const exists = await prisma.order.findUnique({ where: { legacyId: o.id } });
            if (exists) continue;

            const user = await prisma.user.findUnique({ where: { legacyId: o.userId } });
            if (!user) continue;

            const newOrder = await prisma.order.create({
                data: {
                    legacyId: o.id,
                    // Handle numeric timestamp or ISO string from SQLite
                    createdAt: new Date(o.createdAt),
                    userId: user.id
                }
            });

            // OrderItems
            const orderItems = db.prepare('SELECT * FROM OrderItem WHERE orderId = ?').all(o.id);
            for (const oi of orderItems) {
                const item = await prisma.item.findUnique({ where: { legacyId: oi.itemId } });
                if (!item) continue;

                await prisma.orderItem.create({
                    data: {
                        legacyId: oi.id,
                        orderId: newOrder.id,
                        itemId: item.id
                    }
                });
            }
        }
    } catch (e) {
        console.error('Error migrating orders:', e.message);
    }

    console.log('Migration complete.');
}

if (require.main === module) {
    migrate()
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}

module.exports = migrate;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMedia() {
    try {
        const count = await prisma.mediaItem.count();
        console.log(`Total Media Items: ${count}`);

        if (count > 0) {
            const items = await prisma.mediaItem.findMany({ take: 5 });
            console.log('Sample items:', JSON.stringify(items, null, 2));
        } else {
            console.log("Database is empty.");
        }
    } catch (error) {
        console.error("Error connecting to DB:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMedia();

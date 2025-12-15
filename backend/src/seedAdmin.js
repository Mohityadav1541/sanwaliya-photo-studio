const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const email = 'admin@sanwaliyaphotostudio.com';
        const password = 'Admin@123';

        // Check if admin already exists
        const existingAdmin = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.adminUser.create({
            data: {
                email,
                passwordHash: hashedPassword,
                name: 'Admin',
            },
        });

        console.log('Admin created successfully');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        // No change needed for seed, verify logic only.
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seedAdmin();


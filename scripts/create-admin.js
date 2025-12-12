// Create Admin User Script for Sanwaliya Photo Studio
// Run this after migration is complete

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('Creating admin user...');

        // Hash the password
        const hashedPassword = await bcrypt.hash('07081978', 10);

        // Check if admin already exists
        const existing = await prisma.user.findUnique({
            where: { email: 'roshanlalyadav30408@gmail.com' }
        });

        if (existing) {
            console.log('Admin user already exists. Updating password...');
            await prisma.user.update({
                where: { email: 'roshanlalyadav30408@gmail.com' },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('✅ Admin password updated successfully!');
        } else {
            // Create new admin user
            const admin = await prisma.user.create({
                data: {
                    email: 'roshanlalyadav30408@gmail.com',
                    password: hashedPassword,
                    name: 'Roshan Lal Yadav',
                    role: 'ADMIN',
                    phone: '+91 9460304080' // Your phone number
                }
            });

            console.log('✅ Admin user created successfully!');
            console.log('Email:', admin.email);
            console.log('Name:', admin.name);
        }

        console.log('\n🔑 Admin Login Credentials:');
        console.log('Email: roshanlalyadav30408@gmail.com');
        console.log('Password: 07081978');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');

    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();

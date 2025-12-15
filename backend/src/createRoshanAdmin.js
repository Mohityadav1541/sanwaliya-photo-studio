const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const createRoshanAdmin = async () => {
    try {
        const email = 'roshanlalyadav30408@gmail.com';
        const password = 'rambhajan1540';
        const name = 'Roshan Lal Yadav';

        const existingAdmin = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            console.log('Roshan admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.adminUser.create({
            data: {
                email,
                passwordHash: hashedPassword,
                name,
            },
        });

        console.log('Roshan admin created successfully');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
};

createRoshanAdmin();

// Instructions:
// Run this command to create the admin:
// node src/createRoshanAdmin.js

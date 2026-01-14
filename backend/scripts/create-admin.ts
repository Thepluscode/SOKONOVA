// Run this script to create an admin user:
// npx ts-node scripts/create-admin.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@sokonova.com';
    const password = process.argv[3] || 'Admin123!';
    const name = process.argv[4] || 'Admin User';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        // Update to admin role
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`✅ User "${email}" upgraded to ADMIN role`);
    } else {
        // Create new admin user
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
            },
        });
        console.log(`✅ Admin user created!`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
    }
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

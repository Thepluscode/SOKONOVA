// Run this to reset password: npx ts-node scripts/reset-password.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@sokonova.com';
    const newPassword = process.argv[3] || 'Admin123!';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    console.log(`✅ Password reset for "${email}"`);
    console.log(`   New password: ${newPassword}`);
    console.log(`   Role: ${user.role}`);
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

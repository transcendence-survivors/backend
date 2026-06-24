import { PrismaClient } from '@prisma-generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedUsers } from './users';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const main = async () => {
	await seedUsers(prisma);
};

main()
	.then(() => {
		console.log('Seeding completed successfully');
	})
	.catch((error) => {
		console.error('Seeding failed:', error);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

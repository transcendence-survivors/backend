import { PrismaClient } from '@prisma-generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedUsers } from './users';
import {
	seedAddFriends,
	seedReceiveFriendRequests,
	seedSendFriendRequests,
} from './friends';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const main = async () => {
	const { totalAdded, users } = await seedUsers(prisma);
	const oneThird = Math.floor(users.length / 3);

	const user = users[0];
	console.log(`Seeding friendships for user: ${user.id} (${user.username})`);

	const firstThirdUsers = users.slice(1, oneThird);
	const secondThirdUsers = users.slice(oneThird, oneThird * 2);
	const lastThirdUsers = users.slice(oneThird * 2);

	await Promise.all([
		seedSendFriendRequests(
			prisma,
			user.id,
			secondThirdUsers.map((u) => u.id),
		),
		seedReceiveFriendRequests(
			prisma,
			user.id,
			firstThirdUsers.map((u) => u.id),
		),
		seedAddFriends(
			prisma,
			user.id,
			lastThirdUsers.map((u) => u.id),
		),
	]);

	console.log(
		`✅ Seeding completed successfully. Total users added: ${totalAdded}`,
	);
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

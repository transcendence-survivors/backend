import { PrismaClient } from '@prisma-generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedUsers } from './users';
import {
	seedAddFriends,
	seedReceiveFriendRequests,
	seedSendFriendRequests,
} from './friends';
import { seedBlocksBlocked, seedBlocksBlocker } from './blocks';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const main = async () => {
	const { totalAdded, users } = await seedUsers(prisma);
	const oneFifth = Math.floor(users.length / 5);

	const user = users[0];
	console.log(`Seeding friendships for user: ${user.id} (${user.username})`);

	const firstFifthUsers = users.slice(1, oneFifth);
	const secondFifthUsers = users.slice(oneFifth, oneFifth * 2);
	const thirdFifthUsers = users.slice(oneFifth * 2, oneFifth * 3);
	const fourthFifthUsers = users.slice(oneFifth * 3, oneFifth * 4);
	const lastFifthUsers = users.slice(oneFifth * 4);

	await Promise.all([
		seedSendFriendRequests(
			prisma,
			user.id,
			firstFifthUsers.map((u) => u.id),
		),
		seedReceiveFriendRequests(
			prisma,
			user.id,
			secondFifthUsers.map((u) => u.id),
		),
		seedAddFriends(
			prisma,
			user.id,
			thirdFifthUsers.map((u) => u.id),
		),
		seedBlocksBlocker(
			prisma,
			user.id,
			fourthFifthUsers.map((u) => u.id),
		),
		seedBlocksBlocked(
			prisma,
			user.id,
			lastFifthUsers.map((u) => u.id),
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

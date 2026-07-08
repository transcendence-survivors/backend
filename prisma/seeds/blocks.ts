import { PrismaClient } from '@prisma-generated/client';

const seedBlocksBlocker = async (
	prisma: PrismaClient,
	user: string,
	usersToBlock: string[],
) => {
	await prisma.block.createMany({
		data: usersToBlock.map((blockedUserId) => ({
			blockerId: user,
			blockedId: blockedUserId,
		})),
		skipDuplicates: true,
	});
};

const seedBlocksBlocked = async (
	prisma: PrismaClient,
	user: string,
	usersToBlock: string[],
) => {
	await prisma.block.createMany({
		data: usersToBlock.map((blockingUserId) => ({
			blockerId: blockingUserId,
			blockedId: user,
		})),
		skipDuplicates: true,
	});
};

export { seedBlocksBlocker, seedBlocksBlocked };

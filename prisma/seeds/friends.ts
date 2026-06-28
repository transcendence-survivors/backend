import { FriendshipState, PrismaClient } from '@prisma-generated/client';

const seedSendFriendRequests = async (
	prisma: PrismaClient,
	user: string,
	friendsToAdd: string[],
) => {
	await prisma.friendship.createMany({
		data: friendsToAdd.map((friendId) => ({
			userAId: user,
			senderId: user,
			userBId: friendId,
			state: FriendshipState.PENDING,
		})),
		skipDuplicates: true,
	});
};

const seedReceiveFriendRequests = async (
	prisma: PrismaClient,
	user: string,
	friendsToAdd: string[],
) => {
	await prisma.friendship.createMany({
		data: friendsToAdd.map((friendId) => ({
			userAId: user,
			senderId: friendId,
			userBId: friendId,
			state: FriendshipState.PENDING,
		})),
		skipDuplicates: true,
	});
};

const seedAddFriends = async (
	prisma: PrismaClient,
	user: string,
	friendsToAdd: string[],
) => {
	await prisma.friendship.createMany({
		data: friendsToAdd.map((friendId) => ({
			userAId: user,
			senderId: user,
			userBId: friendId,
			state: FriendshipState.ACCEPTED,
		})),
		skipDuplicates: true,
	});
};

export { seedSendFriendRequests, seedReceiveFriendRequests, seedAddFriends };

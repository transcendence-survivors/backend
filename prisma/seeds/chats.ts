import {
	ChatMemberRole,
	ChatMessageType,
	ChatRoomType,
} from '@prisma-generated/enums';
import { fake } from './common/fake';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma-generated/client';
import { ChatMember, ChatRoom } from '@prisma-generated/browser';

export async function seedChatRooms(
	prisma: PrismaClient,
	primaryUserId: string,
	otherUserIds: string[],
	options = { totalRooms: 15, maxMessagesPerRoom: 40 },
) {
	const allUserIds = Array.from(new Set([primaryUserId, ...otherUserIds]));

	if (allUserIds.length < 2) {
		throw new Error('You need at least 2 unique users to seed chat rooms.');
	}

	const createdRooms: ChatRoom[] = [];

	for (let i = 0; i < options.totalRooms; i++) {
		const isDirect = fake.boolean();
		const roomType = isDirect ? ChatRoomType.DIRECT : ChatRoomType.GROUP;

		const isPrimaryCreator = fake.boolean(0.7);
		const creatorId = isPrimaryCreator
			? primaryUserId
			: faker.helpers.arrayElement(otherUserIds);

		let participantIds: string[] = [];

		if (isDirect) {
			const partnerId =
				creatorId === primaryUserId
					? faker.helpers.arrayElement(otherUserIds)
					: primaryUserId;

			participantIds = [creatorId, partnerId];
		} else {
			const groupSize = faker.number.int({
				min: 3,
				max: Math.min(10, allUserIds.length),
			});

			const candidatePool = allUserIds.filter(
				(id) => id !== creatorId && id !== primaryUserId,
			);

			const chosenOthers = faker.helpers.arrayElements(
				candidatePool,
				groupSize - 2,
			);

			participantIds = [creatorId, primaryUserId, ...chosenOthers];
		}

		participantIds = Array.from(new Set(participantIds));

		const roomCreatedAt = fake.date.pastRange(30, 2);

		const room = await prisma.chatRoom.create({
			data: {
				type: roomType,
				name:
					roomType === ChatRoomType.GROUP
						? fake.chat.roomName()
						: null,
				avatarUrl:
					roomType === ChatRoomType.GROUP
						? fake.image.avatar()
						: null,
				createdBy: creatorId,
				createdAt: roomCreatedAt,
				updatedAt: roomCreatedAt,
				lastActivityAt: roomCreatedAt,
			},
		});

		const memberRecords: ChatMember[] = [];
		for (const userId of participantIds) {
			let role: ChatMemberRole = ChatMemberRole.MEMBER;

			if (userId === creatorId) {
				role = ChatMemberRole.OWNER;
			} else if (roomType === ChatRoomType.GROUP && fake.boolean(0.2)) {
				role = ChatMemberRole.ADMIN;
			}

			const joinedAt =
				userId === creatorId
					? roomCreatedAt
					: new Date(
							roomCreatedAt.getTime() +
								faker.number.int({
									min: 1000,
									max: 86_400_000,
								}),
						);

			const member = await prisma.chatMember.create({
				data: {
					roomId: room.id,
					userId,
					role,
					joinedAt,
					lastReadAt: new Date(
						joinedAt.getTime() +
							faker.number.int({ min: 10000, max: 3_600_000 }),
					),
				},
			});
			memberRecords.push(member);
		}

		let currentTimestamp = roomCreatedAt.getTime();
		const createdMessagesInRoom: Array<{ id: string; createdAt: Date }> =
			[];
		const msgCount = faker.number.int({
			min: 5,
			max: options.maxMessagesPerRoom,
		});

		for (let j = 0; j < msgCount; j++) {
			currentTimestamp += faker.number.int({
				min: 60_000,
				max: 21_600_000,
			});
			const messageDate = new Date(currentTimestamp);

			const availableSenderIds = participantIds.filter((id) => {
				const mem = memberRecords.find((m) => m.userId === id);
				return mem && mem.joinedAt <= messageDate;
			});

			if (availableSenderIds.length === 0) continue;

			const senderId = faker.helpers.arrayElement(availableSenderIds);

			const isSystemMessage = roomType === ChatRoomType.GROUP && j === 0;
			const msgType: ChatMessageType = isSystemMessage
				? ChatMessageType.ROOM_CREATED
				: ChatMessageType.TEXT;

			let replyToId: string | undefined = undefined;
			if (
				msgType === ChatMessageType.TEXT &&
				createdMessagesInRoom.length > 0 &&
				fake.boolean(0.2)
			) {
				replyToId = faker.helpers.arrayElement(
					createdMessagesInRoom,
				).id;
			}

			const message = await prisma.chatMessage.create({
				data: {
					roomId: room.id,
					senderId:
						msgType === ChatMessageType.ROOM_CREATED
							? null
							: senderId,
					type: msgType,
					content:
						msgType === ChatMessageType.ROOM_CREATED
							? `Created the room "${room.name}"`
							: fake.chat.messageText(),
					attachmentUrls:
						msgType === ChatMessageType.TEXT
							? fake.chat.attachmentUrls()
							: [],
					replyToId,
					createdAt: messageDate,
					updatedAt: messageDate,
				},
			});

			if (msgType === ChatMessageType.ROOM_CREATED) {
				await prisma.chatMessageMetadata.create({
					data: {
						messageId: message.id,
						newValue: room.name ?? undefined,
					},
				});
			}

			createdMessagesInRoom.push({
				id: message.id,
				createdAt: messageDate,
			});
		}

		const lastMsgTime =
			createdMessagesInRoom.length > 0
				? createdMessagesInRoom[createdMessagesInRoom.length - 1]
						.createdAt
				: roomCreatedAt;

		await prisma.chatRoom.update({
			where: { id: room.id },
			data: { lastActivityAt: lastMsgTime },
		});

		createdRooms.push(room);
	}

	console.log(`✅ Seeded ${createdRooms.length} chat rooms successfully.`);
	return createdRooms;
}

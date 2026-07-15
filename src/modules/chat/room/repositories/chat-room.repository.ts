import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatRoomQueryHelper } from './chat-room-query.helper';
import { ChatRoomListItem } from '../types/records/chat-room-list-item.type';
import { ChatRoomSelect } from '@prisma-generated/models';
import { ChatRoomsCursorParams } from '../types/params/chat-rooms-cursor.params';
import { ChatMemberRole, ChatRoomType } from '@prisma-generated/enums';
import { ChatRoomFindDmParams } from '../types/params/chat-room-find-dm.params';
import { ChatRoomCreateParams } from '../types/params/chat-room-create.params';

@Injectable()
export class ChatRoomRepository {
	constructor(private readonly prisma: PrismaService) {}

	cursor({
		limit,
		cursor,
		search,
		orderBy,
		userId,
		feedMode,
	}: ChatRoomsCursorParams): Promise<ChatRoomListItem[]> {
		return this.prisma.chatRoom.findMany({
			...ChatRoomQueryHelper.pagination(limit, cursor),
			where: {
				AND: [
					ChatRoomQueryHelper.feedWhere(userId, feedMode),
					search ? ChatRoomQueryHelper.searchWhere(search) : {},
				],
			},
			orderBy: ChatRoomQueryHelper.orderBy[orderBy],
			select: {
				...ChatRoomQueryHelper.chatRoomSelect(userId),
			} satisfies Record<
				keyof ChatRoomListItem,
				ChatRoomSelect[keyof ChatRoomListItem]
			>,
		});
	}

	create({
		createdBy,
		type,
		name,
		userIds,
	}: ChatRoomCreateParams): Promise<ChatRoomListItem> {
		return this.prisma.chatRoom.create({
			data: {
				type: type,
				name: name,
				createdBy: createdBy,
				members: {
					create: userIds.map((id) => ({
						userId: id,
						role:
							id === createdBy
								? ChatMemberRole.OWNER
								: ChatMemberRole.MEMBER,
					})),
				},
			},
			select: {
				...ChatRoomQueryHelper.chatRoomSelect(createdBy),
			},
		});
	}

	findExistingDm({
		userAId,
		userBId,
	}: ChatRoomFindDmParams): Promise<{ id: string } | null> {
		return this.prisma.chatRoom.findFirst({
			where: {
				type: ChatRoomType.DIRECT,
				AND: [
					{ members: { some: { userId: userAId } } },
					{ members: { some: { userId: userBId } } },
				],
			},
			select: {
				id: true,
			},
		});
	}

	deleteRoom(roomId: string, userId: string) {
		return this.prisma.chatRoom.deleteMany({
			where: {
				id: roomId,
				members: { some: { userId, role: ChatMemberRole.OWNER } },
			},
		});
	}
}

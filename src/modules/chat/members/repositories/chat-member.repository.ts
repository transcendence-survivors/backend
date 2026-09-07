import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';
import { ChatMemberListItem } from '../types/records/chat-member-list-item';
import { ChatMembersCursorParams } from '../types/params/chat-members-cursor.params';
import { ChatMemberQueryHelper } from './chat-member-query.helper';
import { ChatMemberSelect } from '@prisma-generated/models';
import { ChatMemberCountParams } from '../types/params/chat-member-count.params';

@Injectable()
export class ChatMemberRepository {
	constructor(private readonly prisma: PrismaService) {}

	cursor({
		limit,
		cursor,
		search,
		orderBy,
		roomId,
	}: ChatMembersCursorParams): Promise<ChatMemberListItem[]> {
		return this.prisma.chatMember.findMany({
			...ChatMemberQueryHelper.pagination(limit, cursor),
			where: {
				AND: [
					ChatMemberQueryHelper.whereRoom(roomId),
					ChatMemberQueryHelper.whereSearch(search),
				],
			},
			select: {
				...ChatMemberQueryHelper.chatMemberSelect,
			} satisfies Record<
				keyof ChatMemberListItem,
				ChatMemberSelect[keyof ChatMemberListItem]
			>,
			orderBy: ChatMemberQueryHelper.orderBy[orderBy],
		});
	}

	count({ search, roomId }: ChatMemberCountParams): Promise<number> {
		return this.prisma.chatMember.count({
			where: {
				AND: [
					ChatMemberQueryHelper.whereRoom(roomId),
					ChatMemberQueryHelper.whereSearch(search),
				],
			},
		});
	}

	findByRoomAndUser({ roomId, userId }: ChatMemberFindParams) {
		return this.prisma.chatMember.findUnique({
			where: { roomId_userId: { roomId, userId } },
		});
	}
}

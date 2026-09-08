import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';
import { ChatMemberListItem } from '../types/records/chat-member-list-item';
import { ChatMembersCursorParams } from '../types/params/chat-members-cursor.params';
import { ChatMemberQueryHelper } from './chat-member-query.helper';
import { ChatMemberSelect } from '@prisma-generated/models';
import { ChatMemberCountParams } from '../types/params/chat-member-count.params';
import { ChatMemberRole } from '@prisma-generated/enums';
import { DbContext } from '@/core/database/uow/db-context';
import { ChatMemberRoleInfo } from '../types/records/chat-member-role-info';

interface ChatMembersRoleUpdateParams {
	roomId: string;
	userId: string;
	role: ChatMemberRole;
}

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

	updateRole(
		{ roomId, userId, role }: ChatMembersRoleUpdateParams,
		ctx?: DbContext,
	): Promise<ChatMemberListItem> {
		const client = ctx?.client ?? this.prisma;

		return client.chatMember.update({
			where: {
				roomId_userId: { roomId, userId },
			},
			data: { role },
			select: {
				...ChatMemberQueryHelper.chatMemberSelect,
			},
		});
	}

	async deleteMember({
		roomId,
		userId,
	}: ChatMemberFindParams): Promise<void> {
		await this.prisma.chatMember.delete({
			where: {
				roomId_userId: { roomId, userId },
			},
		});
	}

	findByRoomAndUser({
		roomId,
		userId,
	}: ChatMemberFindParams): Promise<ChatMemberRoleInfo | null> {
		return this.prisma.chatMember.findUnique({
			where: { roomId_userId: { roomId, userId } },
			select: {
				role: true,
			} satisfies Record<
				keyof ChatMemberRoleInfo,
				ChatMemberSelect[keyof ChatMemberRoleInfo]
			>,
		});
	}
}

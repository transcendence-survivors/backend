import {
	ChatRoomOrderByWithRelationInput,
	ChatRoomSelect,
	ChatRoomWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { ChatRoomType } from '@prisma-generated/enums';
import { ChatRoomListItem } from '../types/records/chat-room-list-item.type';
import { ChatRoomOrderByEnum } from '../types/enums/chat-room-order-by.enum';
import { ChatRoomFeedEnum } from '../types/enums/chat-room-feed-enum';

export class ChatRoomQueryHelper {
	public static readonly chatRoomSelect = {
		id: true,
		type: true,
		name: true,
		avatarUrl: true,
		updatedAt: true,
		messages: {
			orderBy: { createdAt: 'desc' },
			take: 1,
			select: {
				content: true,
				createdAt: true,
				sender: {
					select: {
						displayName: true,
					},
				},
			},
		},
		members: {
			select: {
				userId: true,
				role: true,
				user: {
					select: {
						displayName: true,
						avatarUrl: true,
					},
				},
			},
		},
	} satisfies Record<
		keyof ChatRoomListItem,
		ChatRoomSelect[keyof ChatRoomListItem]
	>;

	public static readonly orderBy: Record<
		ChatRoomOrderByEnum,
		ChatRoomOrderByWithRelationInput[]
	> = {
		'updated-desc': [{ updatedAt: 'desc' }, { id: 'desc' }],
		'updated-asc': [{ updatedAt: 'asc' }, { id: 'asc' }],
		'created-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
		'created-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
	};

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	public static searchWhere(search: string): ChatRoomWhereInput {
		const query = search.trim();
		if (!query) {
			return {};
		}

		return {
			OR: [
				{
					name: {
						contains: query,
						mode: 'insensitive',
					},
				},
				{
					members: {
						some: {
							user: {
								displayName: {
									contains: query,
									mode: 'insensitive',
								},
							},
						},
					},
				},
			],
		};
	}

	public static userRoomsWhere(userId: string): ChatRoomWhereInput {
		return {
			members: {
				some: { userId },
			},
		};
	}

	public static feedWhere(
		userId: string,
		feedMode: ChatRoomFeedEnum,
	): ChatRoomWhereInput {
		const baseWhere = ChatRoomQueryHelper.userRoomsWhere(userId);

		switch (feedMode) {
			case ChatRoomFeedEnum.DIRECT:
				return {
					...baseWhere,
					type: ChatRoomType.DIRECT,
				};
			case ChatRoomFeedEnum.GROUP:
				return {
					...baseWhere,
					type: ChatRoomType.GROUP,
				};
			case ChatRoomFeedEnum.ALL:
				return baseWhere;
		}
	}
}

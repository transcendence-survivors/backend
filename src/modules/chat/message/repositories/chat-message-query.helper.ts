import {
	ChatMessageOrderByWithRelationInput,
	ChatMessageSelect,
	ChatMessageWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { ChatMessageListItem } from '../types/records/chat-message-list-item';
import { ChatMessageOrderByEnum } from '../types/enums/chat-message-order-by.enum';

export class ChatMessageQueryHelper {
	public static chatMessageSelect = {
		id: true,
		content: true,
		attachmentUrls: true,
		isEdited: true,
		isDeleted: true,
		replyToId: true,
		createdAt: true,
		sender: {
			select: {
				id: true,
				username: true,
				displayName: true,
				avatarUrl: true,
			},
		},
	} as const satisfies Record<
		keyof ChatMessageListItem,
		ChatMessageSelect[keyof ChatMessageListItem]
	>;

	public static readonly orderBy: Record<
		ChatMessageOrderByEnum,
		ChatMessageOrderByWithRelationInput[]
	> = {
		'created-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
		'created-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
	};

	public static whereRoom(userId: string, roomId: string) {
		return {
			roomId: roomId,
			room: {
				members: {
					some: {
						userId: userId,
					},
				},
			},
		};
	}

	public static whereSearch(search?: string): ChatMessageWhereInput {
		const query = search?.trim();
		if (!query || query.length === 0) {
			return {};
		}

		if (query.startsWith('@')) {
			const username = query
				.slice(1)
				.split(/\s|[!@#$%^&*(),.?":{}|<>]/)[0];
			const content = query.slice(username.length + 2).trim();
			return {
				content: {
					contains: content,
					mode: 'insensitive',
				},
				sender: {
					username: {
						contains: username,
						mode: 'insensitive',
					},
				},
			};
		}

		return {
			content: {
				contains: query,
				mode: 'insensitive',
			},
		};
	}

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}
}

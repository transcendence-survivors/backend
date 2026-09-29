import {
	ChatMemberOrderByWithRelationInput,
	ChatMemberSelect,
	ChatMemberWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { ChatMemberListItem } from '../types/records/chat-member-list-item';
import { ChatMemberOrderByEnum } from '../types/enums/chat-member-order-by.enum';
import { UserQueryHelper } from '@/modules/user/user.public-api';

export class ChatMemberQueryHelper {
	public static chatMemberSelect = {
		id: true,
		roomId: true,
		role: true,
		joinedAt: true,
		user: {
			select: {
				id: true,
				username: true,
				displayName: true,
				avatarUrl: true,
			},
		},
	} as const satisfies Record<
		keyof ChatMemberListItem,
		ChatMemberSelect[keyof ChatMemberListItem]
	>;

	public static readonly orderBy: Record<
		ChatMemberOrderByEnum,
		ChatMemberOrderByWithRelationInput[]
	> = {
		'joined-desc': [{ joinedAt: 'desc' }, { id: 'desc' }],
		'joined-asc': [{ joinedAt: 'asc' }, { id: 'asc' }],
		'username-asc': [{ user: { username: 'asc' } }, { id: 'asc' }],
		'username-desc': [{ user: { username: 'desc' } }, { id: 'desc' }],
		'displayname-asc': [{ user: { displayName: 'asc' } }, { id: 'asc' }],
		'displayname-desc': [{ user: { displayName: 'desc' } }, { id: 'desc' }],
		'role-asc': [{ role: 'asc' }, { id: 'asc' }],
		'role-desc': [{ role: 'desc' }, { id: 'desc' }],
	};

	public static whereRoom(roomId: string): ChatMemberWhereInput {
		return {
			roomId: roomId,
		};
	}

	public static whereSearch(search?: string): ChatMemberWhereInput {
		if (!search || search.trim().length === 0) {
			return {};
		}
		return {
			user: UserQueryHelper.searchWhere(search),
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

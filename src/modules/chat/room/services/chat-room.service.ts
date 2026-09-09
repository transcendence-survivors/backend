import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { ChatRoomMapper } from '../mappers/chat-room.mapper';
import { ChatRoomPaginateDto } from '../dtos/requests/chat-room-paginate.dto';
import { ChatRoomPaginatedListResponseDto } from '../dtos/responses/chat-room-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { ChatRoomCreateDto } from '../dtos/requests/chat-room-create.dto';
import { ChatRoomListItemResponseDto } from '../dtos/responses/chat-room-list-item-response.dto';
import { ChatRoomType } from '@prisma-generated/client';
import { ChatRoomDmConflictException } from '../exceptions/chat-room-conflict.exception';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { ChatUserNotFoundException } from '../exceptions/chat-user-not-found.exception';
import {
	ChatRoomDirectImmutableException,
	ChatRoomUpdateEmptyException,
	SelfChatDmException,
} from '../exceptions/chat-room-bad.exception';
import { ChatRoomNotFoundException } from '../exceptions/chat-room-not-found.exceptions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	APP_EVENTS,
	ChatRoomAvatarChangedEvent,
	ChatRoomCreatedEvent,
	ChatRoomRenamedEvent,
} from '@/contracts/events/internal';
import { ChatRoomUpdateDto } from '../dtos/requests/chat-room-update.dto';
import { ChatMemberService } from '../../members/services/chat-member.service';
import { ChatMemberNotFoundException } from '../../members/exceptions/chat-member-not-found.exception';
import { ChatRoomDetailResponseDto } from '../dtos/responses/chat-room-detail-response.dto';

@Injectable()
export class ChatRoomService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: ChatRoomRepository,
		private readonly memberService: ChatMemberService,
		private readonly mapper: ChatRoomMapper,
		private readonly cursor: CursorService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async listChatRooms(
		dto: ChatRoomPaginateDto,
		userId: string,
	): Promise<ChatRoomPaginatedListResponseDto> {
		const chatRooms = await this.repo.cursor({
			limit: dto.limit,
			cursor: dto.cursor,
			search: dto.search,
			orderBy: dto.orderBy,
			feedMode: dto.type,
			userId,
		});

		const groupRoomIds = chatRooms
			.filter((room) => room.type === ChatRoomType.GROUP)
			.map((room) => room.id);
		const groupMembers = await this.repo.groupMemberIds({
			roomIds: groupRoomIds,
			userId,
		});
		const memberIdsByRoom = groupMembers.reduce<Record<string, string[]>>(
			(acc, m) => {
				(acc[m.roomId] ??= []).push(m.userId);
				return acc;
			},
			{},
		);

		const dtos = this.mapper.toListItemDtoList(chatRooms, memberIdsByRoom);
		const result = this.cursor.create(dtos, dto.limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}

	async getRoom(
		roomId: string,
		userId: string,
	): Promise<ChatRoomDetailResponseDto> {
		const [room, member] = await Promise.all([
			this.repo.findRoom({ roomId, userId }),
			this.memberService.findByRoomAndUser({ roomId, userId }),
		]);
		if (!room) throw new ChatRoomNotFoundException();
		if (!member) throw new ChatMemberNotFoundException();
		const members = await this.repo.groupMemberIds({
			roomIds: [roomId],
			userId,
		});
		const memberIds = members.map((m) => m.userId);
		const currentUserRole = member.role;
		return this.mapper.toDetailDto(room, memberIds, currentUserRole);
	}

	async createRoom(
		{ name, type, usersIds }: ChatRoomCreateDto,
		userId: string,
	): Promise<ChatRoomListItemResponseDto> {
		const uniqueUserIds = Array.from(new Set([userId, ...usersIds]));
		const existingUsersCount =
			await this.userService.getCountIn(uniqueUserIds);

		if (existingUsersCount !== uniqueUserIds.length)
			throw new ChatUserNotFoundException();

		if (type === ChatRoomType.DIRECT) {
			const recipientId = usersIds[0];
			if (recipientId === userId) throw new SelfChatDmException();
			const existingRoom = await this.repo.findDm({
				userAId: userId,
				userBId: recipientId,
			});
			if (existingRoom) throw new ChatRoomDmConflictException();
		}

		const newRoom = await this.repo.create({
			createdBy: userId,
			type: type,
			name: name,
			userIds: uniqueUserIds,
		});

		this.eventEmitter.emit(
			APP_EVENTS.CHAT_ROOM_CREATED,
			new ChatRoomCreatedEvent(newRoom.id, userId),
		);

		return this.mapper.toListItemDto(newRoom, usersIds);
	}

	async updateRoom(
		roomId: string,
		userId: string,
		dto: ChatRoomUpdateDto,
	): Promise<void> {
		if (!dto.name && !dto.avatarUrl)
			throw new ChatRoomUpdateEmptyException();

		const room = await this.repo.findRoom({ roomId, userId });
		if (!room) throw new ChatRoomNotFoundException();
		if (room.type === ChatRoomType.DIRECT)
			throw new ChatRoomDirectImmutableException();

		const oldName = room.name ?? '';
		const oldAvatarUrl = room.avatarUrl ?? '';
		await this.repo.update({
			roomId,
			avatarUrl: dto.avatarUrl,
			name: dto.name,
		});

		if (dto.name && dto.name !== oldName) {
			this.eventEmitter.emit(
				APP_EVENTS.CHAT_ROOM_RENAMED,
				new ChatRoomRenamedEvent(roomId, userId, oldName, dto.name),
			);
		}

		if (dto.avatarUrl !== undefined && dto.avatarUrl !== oldAvatarUrl) {
			this.eventEmitter.emit(
				APP_EVENTS.CHAT_ROOM_AVATAR_CHANGED,
				new ChatRoomAvatarChangedEvent(
					roomId,
					userId,
					oldAvatarUrl,
					dto.avatarUrl,
				),
			);
		}
	}

	async deleteRoom(roomId: string, userId: string): Promise<void> {
		const res = await this.repo.deleteRoom({ roomId, userId });
		if (res.count === 0) throw new ChatRoomNotFoundException();
	}
}

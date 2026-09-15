import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { ChatRoomMapper } from '../mappers/chat-room.mapper';
import { ChatRoomPaginateDto } from '../dtos/requests/chat-room-paginate.dto';
import { ChatRoomPaginatedListResponseDto } from '../dtos/responses/chat-room-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { ChatRoomCreateDto } from '../dtos/requests/chat-room-create.dto';
import { ChatRoomListItemResponseDto } from '../dtos/responses/chat-room-list-item-response.dto';
import {
	ChatMemberRole,
	ChatRoom,
	ChatRoomType,
} from '@prisma-generated/client';
import { ChatRoomDmConflictException } from '../exceptions/chat-room-conflict.exception';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
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
import { InsufficientMemberPermissionException } from '../../members/exceptions/chat-member-forbidden.exception';

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
		dto: ChatRoomCreateDto,
		userId: string,
	): Promise<ChatRoomListItemResponseDto> {
		const uniqueUserIds = Array.from(new Set([userId, ...dto.usersIds]));
		await this.verifyUsersExist(uniqueUserIds);
		if (dto.type === ChatRoomType.DIRECT) {
			await this.assertValidDmCreation(userId, dto.usersIds[0]);
		}
		return this.executeRoomCreation(dto, userId, uniqueUserIds);
	}

	async getOrCreateDirectRoom(
		currentUserId: string,
		targetUserId: string,
	): Promise<ChatRoomListItemResponseDto> {
		if (currentUserId === targetUserId) throw new SelfChatDmException();

		const existingDm = await this.repo.findDm({
			userAId: currentUserId,
			userBId: targetUserId,
		});

		if (existingDm) {
			const room = await this.repo.findRoom({
				roomId: existingDm.id,
				userId: currentUserId,
			});

			if (room) {
				return this.mapper.toListItemDto(room, [targetUserId]);
			}
		}

		const uniqueUserIds = [currentUserId, targetUserId];
		await this.verifyUsersExist(uniqueUserIds);
		return this.executeRoomCreation(
			{
				type: ChatRoomType.DIRECT,
				usersIds: [targetUserId],
				name: '',
			},
			currentUserId,
			uniqueUserIds,
		);
	}

	async updateRoom(
		roomId: string,
		userId: string,
		dto: ChatRoomUpdateDto,
	): Promise<void> {
		const isNameProvided = dto.name !== undefined;
		const isAvatarProvided = dto.avatarUrl !== undefined;
		if (!isNameProvided && !isAvatarProvided) {
			throw new ChatRoomUpdateEmptyException();
		}

		const [room, member] = await Promise.all([
			this.repo.findRoom({ roomId, userId }),
			this.memberService.findByRoomAndUser({ roomId, userId }),
		]);
		if (!room) throw new ChatRoomNotFoundException();
		if (!member) throw new ChatMemberNotFoundException();

		if (room.type === ChatRoomType.DIRECT) {
			throw new ChatRoomDirectImmutableException();
		}

		const hasPermission =
			member.role === ChatMemberRole.OWNER ||
			member.role === ChatMemberRole.ADMIN;

		if (!hasPermission) {
			throw new InsufficientMemberPermissionException();
		}

		const oldName = room.name;
		const oldAvatarUrl = room.avatarUrl;
		await this.repo.update({
			roomId,
			...(isNameProvided && { name: dto.name }),
			...(isAvatarProvided && { avatarUrl: dto.avatarUrl }),
		});

		if (isNameProvided && dto.name !== oldName) {
			this.eventEmitter.emit(
				APP_EVENTS.CHAT_ROOM_RENAMED,
				new ChatRoomRenamedEvent(
					roomId,
					userId,
					oldName ?? '',
					dto.name ?? '',
				),
			);
		}
		if (isAvatarProvided && dto.avatarUrl !== oldAvatarUrl) {
			this.eventEmitter.emit(
				APP_EVENTS.CHAT_ROOM_AVATAR_CHANGED,
				new ChatRoomAvatarChangedEvent(
					roomId,
					userId,
					oldAvatarUrl ?? '',
					dto.avatarUrl ?? '',
				),
			);
		}
	}

	async deleteRoom(roomId: string, userId: string): Promise<void> {
		const res = await this.repo.deleteRoom({ roomId, userId });
		if (res.count === 0) throw new ChatRoomNotFoundException();
	}

	findRoomType(roomId: string): Promise<Pick<ChatRoom, 'type'> | null> {
		return this.repo.findRoomType(roomId);
	}

	private async verifyUsersExist(userIds: string[]): Promise<void> {
		const existingUsersCount = await this.userService.getCountIn(userIds);
		if (existingUsersCount !== userIds.length)
			throw new ChatMemberNotFoundException();
	}
	private async assertValidDmCreation(
		currentUserId: string,
		recipientId: string,
	): Promise<void> {
		if (recipientId === currentUserId) throw new SelfChatDmException();
		const existingRoom = await this.repo.findDm({
			userAId: currentUserId,
			userBId: recipientId,
		});
		if (existingRoom) throw new ChatRoomDmConflictException();
	}
	private async executeRoomCreation(
		dto: ChatRoomCreateDto,
		currentUserId: string,
		uniqueUserIds: string[],
	): Promise<ChatRoomListItemResponseDto> {
		const newRoom = await this.repo.create({
			createdBy: currentUserId,
			type: dto.type,
			name: dto.name,
			userIds: uniqueUserIds,
		});
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_ROOM_CREATED,
			new ChatRoomCreatedEvent(newRoom.id, currentUserId),
		);
		return this.mapper.toListItemDto(newRoom, dto.usersIds);
	}
}

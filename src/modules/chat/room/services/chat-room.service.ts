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
import { SelfChatDmException } from '../exceptions/chat-room-bad.exception';
import { ChatRoomNotFoundException } from '../exceptions/chat-room-not-found.exceptions';

@Injectable()
export class ChatRoomService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: ChatRoomRepository,
		private readonly mapper: ChatRoomMapper,
		private readonly cursor: CursorService,
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
	): Promise<ChatRoomListItemResponseDto> {
		const room = await this.repo.findRoom({ roomId, userId });
		if (!room) throw new ChatRoomNotFoundException();
		const members = await this.repo.groupMemberIds({
			roomIds: [roomId],
			userId,
		});
		const memberIds = members.map((m) => m.userId);
		return this.mapper.toListItemDto(room, memberIds);
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
		return this.mapper.toListItemDto(newRoom, usersIds);
	}

	async deleteRoom(roomId: string, userId: string): Promise<void> {
		const res = await this.repo.deleteRoom({ roomId, userId });
		if (res.count === 0) throw new ChatRoomNotFoundException();
	}
}

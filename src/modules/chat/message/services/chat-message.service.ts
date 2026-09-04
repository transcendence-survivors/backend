import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../repositories/chat-message.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessageNotFoundException } from '../exceptions/chat-message-not-found.exceptions';
import { ChatMessageActionForbiddenException } from '../exceptions/chat-message-forbidden.exceptions';
import { ChatMemberRole } from '@prisma-generated/enums';
import { ChatMessagePaginateDto } from '../dtos/requests/chat-message-paginate.dto';
import { ChatMessageMapper } from '../mappers/chat-message.mapper';
import { ChatMessagePaginatedListResponseDto } from '../dtos/responses/chat-message-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { ChatMessageCountDto } from '../dtos/requests/chat-message-count.dto';
import { ChatMessageCountResponseDto } from '../dtos/responses/chat-room-count-response.dto';
import { ChatMessageCreateDto } from '../dtos/requests/chat-message-create.dto';
import { ChatMemberService } from '../../members/services/chat-member.service';
import { APP_EVENTS } from '@/contracts/events/internal';
import { ChatMessageCreatedEvent } from '@/contracts/events/internal/chat/chat-message-created.event';
import { ChatMessageSoftDeleteEvent } from '@/contracts/events/internal/chat/chat-message-soft-delete.event';
import { ChatMessageEditDto } from '../dtos/requests/chat-message-edit.dto';
import { ChatMessageEditedEvent } from '@/contracts/events/internal/chat/chat-message-edited.event';
import { AttachmentMustBeDeletedEvent } from '@/contracts/events/internal/attachment-must-be-deleted.event';

@Injectable()
export class ChatMessageService {
	private readonly roleHierarchy = {
		[ChatMemberRole.OWNER]: 3,
		[ChatMemberRole.ADMIN]: 2,
		[ChatMemberRole.MEMBER]: 1,
	};

	constructor(
		private readonly repo: ChatMessageRepository,
		private readonly memberService: ChatMemberService,
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: ChatMessageMapper,
		private readonly cursor: CursorService,
	) {}

	async listMessages(
		{ limit, cursor, search, orderBy }: ChatMessagePaginateDto,
		userId: string,
		roomId: string,
	): Promise<ChatMessagePaginatedListResponseDto> {
		const messages = await this.repo.cursor({
			limit,
			cursor,
			search,
			orderBy,
			userId,
			roomId,
		});

		const dtos = this.mapper.toListItemDtoList(messages);
		const pagination = this.cursor.create(dtos, limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(pagination);
	}

	async countMessages(
		{ search }: ChatMessageCountDto,
		userId: string,
		roomId: string,
	): Promise<ChatMessageCountResponseDto> {
		const messages = await this.repo.count({
			search,
			userId,
			roomId,
		});

		return this.mapper.toCountDto(messages);
	}

	async create(roomId: string, userId: string, dto: ChatMessageCreateDto) {
		await this.checkPerm(userId, userId, roomId);

		if (!dto.content?.trim() && !dto.attachmentUrls?.length) {
			throw new BadRequestException(
				'Message must have content or an attachment',
			);
		}

		const message = await this.repo.create({
			roomId,
			senderId: userId,
			content: dto.content,
			attachmentUrls: dto.attachmentUrls ?? [],
			replyToId: dto.replyToId,
		});
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_MESSAGE_CREATED,
			new ChatMessageCreatedEvent(message),
		);
		return message;
	}

	async softDelete(messageId: string, userId: string): Promise<void> {
		const message = await this.repo.findById(messageId);
		if (!message) throw new ChatMessageNotFoundException();
		await this.checkPerm(userId, message.senderId, message.roomId);
		await this.repo.softDelete(messageId);

		if (message.attachmentUrls?.length > 0) {
			this.eventEmitter.emit(
				APP_EVENTS.ATTACHMENTS_MUST_BE_DELETED,
				new AttachmentMustBeDeletedEvent(message.attachmentUrls),
			);
		}
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_MESSAGE_SOFT_DELETED,
			new ChatMessageSoftDeleteEvent(messageId, message.roomId),
		);
	}

	async edit(
		{ messageId, content }: ChatMessageEditDto,
		userId: string,
	): Promise<void> {
		const message = await this.repo.findById(messageId);
		if (!message) throw new ChatMessageNotFoundException();
		await this.checkPerm(userId, message.senderId, message.roomId, false);

		const updated = await this.repo.edit(messageId, content);
		if (!updated) throw new ChatMessageNotFoundException();
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_MESSAGE_EDITED,
			new ChatMessageEditedEvent(updated),
		);
	}

	async checkPerm(
		userId: string,
		senderId: string,
		roomId: string,
		roleCheck: boolean = true,
	): Promise<void> {
		if (userId === senderId) {
			const member = await this.memberService.findByRoomAndUser({
				roomId,
				userId,
			});
			if (!member) throw new ChatMessageActionForbiddenException();
			return;
		}
		if (!roleCheck) return;
		const [user, sender] = await Promise.all([
			this.memberService.findByRoomAndUser({ roomId, userId }),
			this.memberService.findByRoomAndUser({ roomId, userId: senderId }),
		]);
		if (!user || !sender) throw new ChatMessageActionForbiddenException();
		if (this.roleHierarchy[user.role] <= this.roleHierarchy[sender.role])
			throw new ChatMessageActionForbiddenException();
	}
}

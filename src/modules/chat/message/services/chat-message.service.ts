import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../repositories/chat-message.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessageNotFoundException } from '../exceptions/chat-message-not-found.exceptions';
import { ChatMessageActionForbiddenException } from '../exceptions/chat-message-forbidden.exceptions';
import { ChatMemberRole } from '@prisma-generated/enums';

@Injectable()
export class ChatMessageService {
	private readonly roleHierarchy = {
		[ChatMemberRole.OWNER]: 3,
		[ChatMemberRole.ADMIN]: 2,
		[ChatMemberRole.MEMBER]: 1,
	};

	constructor(
		private readonly repo: ChatMessageRepository,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async softDelete(messageId: string, userId: string) {
		const message = await this.repo.findById(messageId);
		if (!message) throw new ChatMessageNotFoundException();
		await this.checkPerm(userId, message.senderId, message.roomId);

		const deleted = await this.repo.softDelete(messageId);
		this.eventEmitter.emit('message.deleted', deleted);
		return deleted;
	}

	async checkPerm(
		userId: string,
		senderId: string,
		roomId: string,
	): Promise<void> {
		if (userId === senderId) return;
		const [user, sender] = await Promise.all([
			this.repo.findByRoomAndUser({ roomId, userId }),
			this.repo.findByRoomAndUser({ roomId, userId: senderId }),
		]);
		if (!user || !sender) throw new ChatMessageActionForbiddenException();
		if (this.roleHierarchy[user.role] <= this.roleHierarchy[sender.role])
			throw new ChatMessageActionForbiddenException();
	}
}

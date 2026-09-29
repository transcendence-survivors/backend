import { Injectable } from '@nestjs/common';
import { ChatNotificationRepository } from '../repositories/chat-notification.repository';
import { ChatNotificationUnreadCountResponseDto } from '../dto/reponses/chat-notification-unread-count-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ChatNotificationService {
	constructor(private readonly repo: ChatNotificationRepository) {}

	async retrieveUnreadCount(
		userId: string,
	): Promise<ChatNotificationUnreadCountResponseDto> {
		const totalUnreadCount = await this.getTotalUnreadCount(userId);
		return plainToInstance(
			ChatNotificationUnreadCountResponseDto,
			{
				totalUnreadCount,
			},
			{ excludeExtraneousValues: true },
		);
	}

	async getUnreadCountsForRooms(
		userId: string,
		roomIds: string[],
	): Promise<Record<string, number>> {
		const unreadCountsMap: Record<string, number> = {};
		for (const id of roomIds) unreadCountsMap[id] = 0;
		if (roomIds.length === 0) return unreadCountsMap;

		const cutoffs = await this.repo.findReadCutoffsForRooms(
			userId,
			roomIds,
		);
		if (cutoffs.length === 0) return unreadCountsMap;

		const minCutoffDate = cutoffs.reduce(
			(earliest, c) =>
				c.cutoffDate < earliest ? c.cutoffDate : earliest,
			new Date(),
		);

		const candidateMessages = await this.repo.findCandidateMessages(
			userId,
			roomIds,
			minCutoffDate,
		);

		const cutoffByRoom = new Map<string, Date>(
			cutoffs.map((c) => [c.roomId, c.cutoffDate]),
		);

		for (const msg of candidateMessages) {
			const cutoff = cutoffByRoom.get(msg.roomId);
			if (cutoff && msg.createdAt > cutoff) {
				unreadCountsMap[msg.roomId] =
					(unreadCountsMap[msg.roomId] || 0) + 1;
			}
		}

		return unreadCountsMap;
	}

	async getTotalUnreadCount(userId: string): Promise<number> {
		const cutoffs = await this.repo.findReadCutoffsForRooms(userId);
		if (cutoffs.length === 0) return 0;

		const allRoomIds = cutoffs.map((c) => c.roomId);
		const minCutoffDate = cutoffs.reduce(
			(earliest, c) =>
				c.cutoffDate < earliest ? c.cutoffDate : earliest,
			new Date(),
		);

		const candidateMessages = await this.repo.findCandidateMessages(
			userId,
			allRoomIds,
			minCutoffDate,
		);

		const cutoffByRoom = new Map<string, Date>(
			cutoffs.map((c) => [c.roomId, c.cutoffDate]),
		);

		let total = 0;
		for (const msg of candidateMessages) {
			const cutoff = cutoffByRoom.get(msg.roomId);
			if (cutoff && msg.createdAt > cutoff) {
				total++;
			}
		}
		return total;
	}

	async markRoomAsRead(userId: string, roomId: string): Promise<Date> {
		return this.repo.updateLastReadAt(userId, roomId);
	}
	async markRoomAsReadForUsers(
		roomId: string,
		userIds: string[],
		readAt?: Date,
	): Promise<void> {
		return this.repo.updateLastReadAtForUsers(roomId, userIds, readAt);
	}
}

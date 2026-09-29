import { Injectable } from '@nestjs/common';

import { FriendshipState } from '@prisma-generated/client';
import { plainToInstance } from 'class-transformer';
import { RelationshipRepository } from '../repositories/relationship.repository';
import { RelationshipStatus } from '../types/enums/relationship-status.enum';
import { RelationshipStatusResponseDto } from '../dtos/responses/relationship-status-response.dto';
import { FriendshipRelationship } from '../types/records/friendship-relationship.type';
import { BlockRelationship } from '../types/records/block-relationship.type copy';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { UserNotFoundException } from '@/modules/user/exceptions/user-not-found.exception';

@Injectable()
export class RelationshipService {
	constructor(
		private readonly repo: RelationshipRepository,
		@InjectUserService() private readonly userService: IUserService,
	) {}

	async getStatus(
		currentUserId: string,
		userName: string,
	): Promise<RelationshipStatusResponseDto> {
		const user = await this.userService.getItemByUsername(userName);
		if (!user) throw new UserNotFoundException();

		const params = { userId1: currentUserId, userId2: user.id };

		const [blocks, friendship] = await Promise.all([
			this.repo.findBlocksBetween(params),
			this.repo.findFriendshipBetween(params),
		]);

		const status =
			this.resolveBlockStatus(blocks, currentUserId, user.id) ??
			this.resolveFriendshipStatus(friendship, currentUserId) ??
			RelationshipStatus.NONE;

		return plainToInstance(
			RelationshipStatusResponseDto,
			{
				id: user.id,
				username: userName,
				displayName: user.displayName,
				status,
			},
			{ excludeExtraneousValues: true },
		);
	}

	private resolveBlockStatus(
		blocks: BlockRelationship[],
		currentUserId: string,
		targetUserId: string,
	): RelationshipStatus | null {
		if (blocks.length === 0) return null;

		const isBlockingTarget = blocks.some(
			(b) => b.blockerId === currentUserId,
		);
		const isBlockedByTarget = blocks.some(
			(b) => b.blockerId === targetUserId,
		);

		if (isBlockingTarget && isBlockedByTarget)
			return RelationshipStatus.MUTUAL_BLOCK;
		if (isBlockingTarget) return RelationshipStatus.BLOCKED_BY_YOU;
		if (isBlockedByTarget) return RelationshipStatus.BLOCKED_BY_THEM;

		return null;
	}

	private resolveFriendshipStatus(
		friendship: FriendshipRelationship | null,
		currentUserId: string,
	): RelationshipStatus | null {
		if (!friendship) return null;

		if (friendship.state === FriendshipState.ACCEPTED) {
			return RelationshipStatus.FRIENDS;
		}

		if (friendship.state === FriendshipState.PENDING) {
			return friendship.senderId === currentUserId
				? RelationshipStatus.REQUEST_SENT
				: RelationshipStatus.REQUEST_RECEIVED;
		}

		return null;
	}
}

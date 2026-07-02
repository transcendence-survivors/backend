import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { FriendshipState } from '@prisma-generated/enums';
import {
	FriendRequestCountQuery,
	FriendRequestCursorQuery,
} from '../dto/friend-request-query.dto';
import { InjectBlockService } from '@/contracts/services/block/block-service.inject';
import { type IBlockService } from '@/contracts/services/block/block-service.port';

import {
	SelfFriendDeleteException,
	SelfFriendRequestDeleteException,
	SelfFriendRequestSentException,
} from '../exceptions/friend.bad.exception';
import {
	FriendDoesNotExistException,
	FriendRequestDoesNotExistException,
} from '../exceptions/friend.not-found.exception';
import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend.conflict.exception';
import {
	FriendshipBlockedByUserException,
	FriendshipBlockedByYouException,
} from '../exceptions/friend.forbidden.exception';
import { FriendRequestSelfAcceptException } from '../exceptions/friend.unprocessable.exception';
import {
	FriendIdsCountQueryDto,
	FriendIdsQueryDto,
} from '../dto/friendIds-query.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { FriendQueryDto } from '../dto/friend-query.dto';

@Injectable()
export class FriendService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		@InjectBlockService() private readonly blockService: IBlockService,
		private readonly repo: FriendRepository,
		private readonly cursor: CursorService,
	) {}

	async requestCursor(userId: string, query: FriendRequestCursorQuery) {
		const data = await this.repo.cursor({
			status: FriendshipState.PENDING,
			...query,
			userId,
		});

		const requests = data.map((f) => {
			const friend = f.userA.id === userId ? f.userB : f.userA;
			return {
				id: f.id,
				status: f.state,
				since: f.createdAt,
				friend,
			};
		});
		return this.cursor.create(requests, query.limit, (item) => item.id);
	}
	async countRequests(userId: string, query: FriendRequestCountQuery) {
		const count = await this.repo.count({
			...query,
			userId,
			status: FriendshipState.PENDING,
		});
		return { count };
	}

	async sendRequest(userId: string, friendId: string) {
		if (userId === friendId) throw new SelfFriendRequestSentException();

		await this.userService.validateUserId(friendId);
		await this.validateBlock(userId, friendId);
		await this.validateFriendship(userId, friendId);

		return this.repo.save({ userId, friendId });
	}

	async acceptRequest(userId: string, friendId: string) {
		if (userId === friendId) throw new FriendRequestSelfAcceptException();

		const friendship = await this.repo.findFriendShip(userId, friendId);
		if (!friendship) throw new FriendRequestDoesNotExistException();

		if (friendship.senderId === userId)
			throw new FriendRequestSelfAcceptException();
		if (friendship.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();

		return this.repo.accept({ userId, friendId });
	}
	async removeRequest(userId: string, friendId: string) {
		if (userId === friendId) throw new SelfFriendRequestDeleteException();

		const { count } = await this.repo.delete({
			userId,
			friendId,
			status: FriendshipState.PENDING,
		});
		if (count === 0) throw new FriendRequestDoesNotExistException();
	}

	async friendsCursor(userId: string, query: FriendQueryDto) {
		const data = await this.repo.cursor({
			...query,
			userId,
			status: FriendshipState.ACCEPTED,
		});

		const friends = data.map((f) => {
			const friend = f.userA.id === userId ? f.userB : f.userA;
			return {
				id: f.id,
				status: f.state,
				since: f.updatedAt,
				friend,
			};
		});

		return this.cursor.create(friends, query.limit, (item) => item.id);
	}
	async countFriends(userId: string, search?: string) {
		const count = await this.repo.count({
			userId,
			search,
			status: FriendshipState.ACCEPTED,
		});
		return { count };
	}

	async friendsCursorFromIds(userId: string, query: FriendIdsQueryDto) {
		const data = await this.repo.cursorIds({
			...query,
			userId,
		});

		const friends = data.map((f) => {
			const friend = f.userA.id === userId ? f.userB : f.userA;
			return {
				id: f.id,
				status: f.state,
				since: f.updatedAt,
				friend,
			};
		});
		return this.cursor.create(friends, query.limit, (item) => item.id);
	}
	async countFriendsFromIds(userId: string, query: FriendIdsCountQueryDto) {
		const count = await this.repo.countIds({
			...query,
			userId,
		});
		return { count };
	}

	async removeFriend(userId: string, friendId: string) {
		if (userId === friendId) throw new SelfFriendDeleteException();

		const { count } = await this.repo.delete({
			userId,
			friendId,
			status: FriendshipState.ACCEPTED,
		});
		if (count === 0) throw new FriendDoesNotExistException();
	}

	private async validateFriendship(userId: string, friendId: string) {
		const friendship = await this.repo.findFriendShip(userId, friendId);

		if (friendship?.state === FriendshipState.PENDING)
			throw new FriendRequestAlreadySentException();
		if (friendship?.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();
	}

	private async validateBlock(userId: string, friendId: string) {
		const [blocker, blocked] =
			await this.blockService.findBlockerBlockedById(userId, friendId);

		if (blocked) throw new FriendshipBlockedByUserException();
		if (blocker) throw new FriendshipBlockedByYouException();
	}

	public removeIfExists(userId: string, friendId: string) {
		return this.repo.delete({ userId, friendId });
	}
}

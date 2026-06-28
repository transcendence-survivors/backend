import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { PaginationService } from '@/shared/services/pagination.service';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { FriendshipState } from '@prisma-generated/enums';
import { FriendQueryDto } from '../dto/friend-query.dto';
import {
	FriendRequestCursorQuery,
	FriendRequestQueryDto,
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
import { FriendIdsQueryDto } from '../dto/friendIds-query.dto';

@Injectable()
export class FriendService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		@InjectBlockService() private readonly blockService: IBlockService,
		private readonly repo: FriendRepository,
		private readonly pagination: PaginationService,
	) {}

	async findRequestsPage(userId: string, query: FriendRequestQueryDto) {
		const [data, total] = await this.repo.paginate({
			userId,
			status: FriendshipState.PENDING,
			...query,
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
		return this.pagination.create(requests, query.page, query.limit, total);
	}
	async findRequestsCursor(userId: string, query: FriendRequestCursorQuery) {
		const [data, total] = await this.repo.findRequestsCursor({
			...query,
			userId,
			status: FriendshipState.PENDING,
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

		return this.pagination.cursor(
			requests,
			query.limit,
			total,
			(item) => item.id,
		);
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

		const { count } = await this.repo.deleteFromState({
			userId,
			friendId,
			status: FriendshipState.PENDING,
		});
		if (count === 0) throw new FriendRequestDoesNotExistException();
	}

	async findFriendsPage(userId: string, query: FriendQueryDto) {
		const [data, total] = await this.repo.paginate({
			userId,
			status: FriendshipState.ACCEPTED,
			...query,
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
		return this.pagination.create(friends, query.page, query.limit, total);
	}
	async findFriendsPageFromIds(userId: string, query: FriendIdsQueryDto) {
		const [data, total] = await this.repo.paginateFromIds({
			userId,
			...query,
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

		return this.pagination.create(friends, query.page, query.limit, total);
	}

	async removeFriend(userId: string, friendId: string) {
		if (userId === friendId) throw new SelfFriendDeleteException();

		const { count } = await this.repo.deleteFromState({
			userId,
			friendId,
			status: FriendshipState.ACCEPTED,
		});
		if (count === 0) throw new FriendDoesNotExistException();
	}

	public removeIfExists(userId: string, friendId: string) {
		return this.repo.delete({ userId, friendId });
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
}

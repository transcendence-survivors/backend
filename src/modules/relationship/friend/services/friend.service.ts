import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { PaginationService } from '@/shared/services/pagination.service';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { FriendshipState } from '@prisma-generated/enums';

import {
	BadAddFriendException,
	BadFriendDeleteException,
} from '../exceptions/friend.bad.exception';
import {
	FriendNotFoundException,
	FriendRequestDoesNotExistException,
} from '../exceptions/friend.not-found.exceptions';

import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend.conflict.exception';

import { FriendQueryDto } from '../dto/friend-query.dto';
import { InjectBlockService } from '@/contracts/services/block/block-service.inject';
import { type IBlockService } from '@/contracts/services/block/block-service.port';
import {
	FriendshipBlockedByUserException,
	FriendshipBlockedByYouException,
} from '../exceptions/friend.forbidden.exception';
import { FriendshipSelfAcceptException } from '../exceptions/friend.unprocessable';

@Injectable()
export class FriendService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		@InjectBlockService() private readonly blockService: IBlockService,
		private readonly repo: FriendRepository,
		private readonly pagination: PaginationService,
	) {}

	async create(userId: string, friendId: string) {
		if (userId === friendId) throw new BadAddFriendException();
		await this.valideFriendship(userId, friendId);

		await this.userService.validateUserId(friendId);
		await this.validateBlock(userId, friendId);
		return this.repo.save({ userId, friendId });
	}

	async remove(userId: string, friendId: string) {
		if (userId === friendId) throw new BadFriendDeleteException();

		const friend = await this.repo.findFriendShip(userId, friendId);
		if (!friend) throw new FriendNotFoundException();

		return this.repo.delete({ userId, friendId });
	}

	async accept(userId: string, friendId: string) {
		if (userId === friendId) throw new FriendshipSelfAcceptException();

		const friend = await this.repo.findFriendShip(userId, friendId);
		if (!friend) throw new FriendRequestDoesNotExistException();

		if (friend.senderId === userId)
			throw new FriendshipSelfAcceptException();
		if (friend.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();

		return this.repo.accept({ userId, friendId });
	}

	async findPage(userId: string, query: FriendQueryDto) {
		const { page, limit, status } = query;
		const [data, total] = await this.repo.paginate({
			userId,
			...query,
		});
		const friends = data.map((f) => ({
			friendshipId: f.id,
			status: f.state,
			since:
				status === FriendshipState.ACCEPTED ? f.createdAt : f.updatedAt,
			friend: f.userA.id === userId ? f.userB : f.userA,
		}));
		return this.pagination.create(friends, page, limit, total);
	}

	private async valideFriendship(userId: string, friendId: string) {
		const friend = await this.repo.findFriendShip(userId, friendId);
		if (friend?.state === FriendshipState.PENDING)
			throw new FriendRequestAlreadySentException();
		if (friend?.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();
	}

	private async validateBlock(userId: string, friendId: string) {
		const [blocker, blocked] =
			await this.blockService.findBlockedBlockerById(userId, friendId);

		if (blocked) throw new FriendshipBlockedByUserException();
		if (blocker) throw new FriendshipBlockedByYouException();
	}
}

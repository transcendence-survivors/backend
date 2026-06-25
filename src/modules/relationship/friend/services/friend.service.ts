import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { PaginationService } from '@/shared/services/pagination.service';
import { type IUserService } from '@/contracts/services/user-service.port';
import { InjectUserService } from '@/contracts/services/user-service.inject';
import { FriendshipState } from '@prisma-generated/enums';

import {
	BadFriendAcceptException,
	BadFriendException,
} from '../exceptions/friend.bad.exception';
import {
	FriendNotFoundException,
	FriendRequestNotFoundException,
} from '../exceptions/friend.not-found.exceptions';
import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend.conflict.exception';
import { FriendQueryDto } from '../dto/friend-query.dto';

@Injectable()
export class FriendService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: FriendRepository,
		private readonly pagination: PaginationService,
	) {}

	async create(userId: string, friendId: string) {
		if (userId === friendId) throw new BadFriendException();

		const friend = await this.repo.findFriendShip(userId, friendId);
		if (friend?.state === FriendshipState.PENDING)
			throw new FriendRequestAlreadySentException();
		if (friend?.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();

		await this.userService.validateUserId(friendId);
		return this.repo.save({ userId, friendId });
	}

	async remove(userId: string, friendId: string) {
		if (userId === friendId) throw new BadFriendException();

		const friend = await this.repo.findFriendShip(userId, friendId);
		if (!friend) throw new FriendNotFoundException();

		return this.repo.delete({ userId, friendId });
	}

	async accept(userId: string, friendId: string) {
		if (userId === friendId) throw new BadFriendException();

		const friend = await this.repo.findFriendShip(userId, friendId);
		if (!friend) throw new FriendRequestNotFoundException();

		if (friend.senderId === userId) throw new BadFriendAcceptException();
		if (friend.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();

		return this.repo.accept({ userId, friendId });
	}

	async findPage(userId: string, query: FriendQueryDto) {
		const { page, limit, orderBy, search, status } = query;
		const [data, total] = await this.repo.paginate({
			userId,
			page,
			limit,
			orderBy,
			status,
			search,
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
}

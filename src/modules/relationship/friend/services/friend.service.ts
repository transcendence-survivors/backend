import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { FriendshipState } from '@prisma-generated/enums';
import { InjectBlockService } from '@/contracts/services/block/block-service.inject';
import { type IBlockService } from '@/contracts/services/block/block-service.port';
import {
	SelfFriendDeleteException,
	SelfFriendRequestDeleteException,
	SelfFriendRequestSentException,
} from '../exceptions/friend-bad.exception';
import {
	FriendDoesNotExistException,
	FriendRequestDoesNotExistException,
} from '../exceptions/friend-not-found.exception';
import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend-conflict.exception';
import {
	FriendshipBlockedByUserException,
	FriendshipBlockedByYouException,
} from '../exceptions/friend-forbidden.exception';
import { FriendRequestSelfAcceptException } from '../exceptions/friend-unprocessable.exception';
import { CursorService } from '@/shared/services/cursor.service';
import { FriendRequestCountDto } from '../dtos/requests/friend-count-paginate.dto';
import { FriendPaginateDto } from '../dtos/requests/friend-paginate.dto';
import { FriendRequestPaginateDto } from '../dtos/requests/friend-request-paginate.dto';
import { FriendIdsPaginateDto } from '../dtos/requests/friend-ids-paginate.dto';
import { FriendIdsCountDto } from '../dtos/requests/friend-ids-count.dto';
import { FriendShipListItemParams } from '../types/params/friendship-list-item.params';
import { FriendShipListItem } from '../types/records/friendship-list-item.type';
import { FriendshipMapper } from '../mappers/friendship.mapper';
import { FriendshipPaginatedResponseDto } from '../dtos/responses/friend-paginated-response.dto';
import { FriendshipCountResponseDto } from '../dtos/responses/friendship-count-response.dto';

@Injectable()
export class FriendService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		@InjectBlockService() private readonly blockService: IBlockService,
		private readonly repo: FriendRepository,
		private readonly cursor: CursorService,
		private readonly mapper: FriendshipMapper,
	) {}

	private toFriendShipListItem(
		friends: FriendShipListItemParams[],
		userId: string,
	): FriendShipListItem[] {
		return friends.map((f) => ({
			id: f.id,
			status: f.state,
			since:
				f.state === FriendshipState.ACCEPTED
					? f.updatedAt
					: f.createdAt,
			friend: f.userA.id === userId ? f.userB : f.userA,
		}));
	}

	async paginateRequest(
		userId: string,
		{ direction, limit, orderBy, search, cursor }: FriendRequestPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		const data = await this.repo.cursor({
			status: FriendshipState.PENDING,
			direction,
			limit,
			orderBy,
			search,
			cursor,
			userId,
		});

		const requests = this.toFriendShipListItem(data, userId);
		const dtos = this.mapper.toListItemDtoList(requests);
		const result = this.cursor.create(dtos, limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}
	async countRequests(
		userId: string,
		{ direction, search }: FriendRequestCountDto,
	): Promise<FriendshipCountResponseDto> {
		const count = await this.repo.count({
			userId,
			direction,
			search,
			status: FriendshipState.PENDING,
		});
		return this.mapper.toCountDto(count);
	}

	async sendRequest(userId: string, friendId: string) {
		if (userId === friendId) throw new SelfFriendRequestSentException();

		await this.userService.validateUserId(friendId);
		await this.validateBlock(userId, friendId);
		await this.validateFriendship(userId, friendId);

		const result = await this.repo.save({ userId, friendId });
		return this.mapper.toFriendRequestCreatedDto(result);
	}

	async acceptRequest(userId: string, friendId: string): Promise<void> {
		if (userId === friendId) throw new FriendRequestSelfAcceptException();

		const friendship = await this.repo.findFriendShip(userId, friendId);
		if (!friendship) throw new FriendRequestDoesNotExistException();

		if (friendship.senderId === userId)
			throw new FriendRequestSelfAcceptException();
		if (friendship.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();

		await this.repo.accept({ userId, friendId });
	}
	async removeRequest(userId: string, friendId: string): Promise<void> {
		if (userId === friendId) throw new SelfFriendRequestDeleteException();

		const { count } = await this.repo.delete({
			userId,
			friendId,
			status: FriendshipState.PENDING,
		});
		if (count === 0) throw new FriendRequestDoesNotExistException();
	}

	async paginateFriends(
		userId: string,
		{ limit, orderBy, search, cursor }: FriendPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		const data = await this.repo.cursor({
			limit,
			orderBy,
			search,
			cursor,
			userId,
			status: FriendshipState.ACCEPTED,
		});

		const friends = this.toFriendShipListItem(data, userId);
		return this.cursor.create(friends, limit, (item) => item.id);
	}
	async countFriends(
		userId: string,
		search?: string,
	): Promise<FriendshipCountResponseDto> {
		const count = await this.repo.count({
			userId,
			search,
			status: FriendshipState.ACCEPTED,
		});
		return this.mapper.toCountDto(count);
	}

	async friendsCursorFromIds(
		userId: string,
		{
			friendIds,
			limit,
			orderBy,
			search,
			cursor,
			status,
		}: FriendIdsPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		const data = await this.repo.cursorIds({
			friendIds,
			limit,
			orderBy,
			search,
			cursor,
			status,
			userId,
		});

		const friends = this.toFriendShipListItem(data, userId);
		const dtos = this.mapper.toListItemDtoList(friends);
		const result = this.cursor.create(dtos, limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}
	async countFriendsFromIds(
		userId: string,
		{ friendIds, search, status }: FriendIdsCountDto,
	) {
		const count = await this.repo.countIds({
			friendIds,
			search,
			status,
			userId,
		});
		return this.mapper.toCountDto(count);
	}

	async removeFriend(userId: string, friendId: string): Promise<void> {
		if (userId === friendId) throw new SelfFriendDeleteException();

		const { count } = await this.repo.delete({
			userId,
			friendId,
			status: FriendshipState.ACCEPTED,
		});
		if (count === 0) throw new FriendDoesNotExistException();
	}

	private async validateFriendship(
		userId: string,
		friendId: string,
	): Promise<void> {
		const friendship = await this.repo.findFriendShip(userId, friendId);

		if (friendship?.state === FriendshipState.PENDING)
			throw new FriendRequestAlreadySentException();
		if (friendship?.state === FriendshipState.ACCEPTED)
			throw new FriendAlreadyExistsException();
	}

	private async validateBlock(
		userId: string,
		friendId: string,
	): Promise<void> {
		const [blocker, blocked] =
			await this.blockService.findBlockerBlockedById(userId, friendId);

		if (blocked) throw new FriendshipBlockedByUserException();
		if (blocker) throw new FriendshipBlockedByYouException();
	}

	public async removeIfExists(
		userId: string,
		friendId: string,
	): Promise<number> {
		const res = await this.repo.delete({ userId, friendId });
		return res.count;
	}
}

import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	UseGuards,
	Post,
	Query,
	Get,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { FriendPaginateDto } from '../dtos/requests/friend-paginate.dto';
import { FriendCountDto } from '../dtos/requests/friend-count.dto';
import { FriendIdsPaginateDto } from '../dtos/requests/friend-ids-paginate.dto';
import { FriendIdsCountDto } from '../dtos/requests/friend-ids-count.dto';

@Controller('friends')
@UseGuards(JWTAccessGuard)
export class FriendController {
	constructor(private readonly service: FriendService) {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Friends retrieved successfully')
	get(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendPaginateDto,
	) {
		return this.service.friendsCursor(user.sub, query);
	}

	@Get('count')
	@HttpCode(200)
	@ResponseEnvelope('Friends count retrieved successfully')
	count(
		@CurrentUser() user: JwtAccessPayload,
		@Query() { search }: FriendCountDto,
	) {
		return this.service.countFriends(user.sub, search);
	}

	@Post('ids')
	@HttpCode(200)
	@ResponseEnvelope('Friends retrieved successfully')
	getFriendsByIds(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendIdsPaginateDto,
	) {
		return this.service.friendsCursorFromIds(user.sub, body);
	}

	@Post('ids/count')
	@HttpCode(200)
	@ResponseEnvelope('Friends count retrieved successfully')
	countFriendsByIds(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendIdsCountDto,
	) {
		return this.service.countFriendsFromIds(user.sub, body);
	}

	@HttpCode(204)
	@Delete(':friendId')
	async remove(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	) {
		await this.service.removeFriend(user.sub, friendId);
	}
}

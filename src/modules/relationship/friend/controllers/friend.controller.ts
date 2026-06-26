import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Query,
	Param,
	UseGuards,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { FriendQueryDto } from '../dto/friend-query.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@Controller('friends')
@UseGuards(JWTAccessGuard)
export class FriendController {
	constructor(private readonly service: FriendService) {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Friends retrieved successfully')
	async getFriends(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendQueryDto,
	) {
		return this.service.findFriendsPage(user.sub, query);
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

import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Query,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { FriendRequestAddDto } from '../dto/friend-request-add.dto';
import {
	FriendRequestCountQuery,
	FriendRequestCursorQuery,
} from '../dto/friend-request-query.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@Controller('friends/requests')
@UseGuards(JWTAccessGuard)
export class FriendRequestController {
	constructor(private readonly service: FriendService) {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Friend requests retrieved successfully')
	async getCursorPage(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendRequestCursorQuery,
	) {
		return this.service.findRequestsCursor(user.sub, query);
	}

	@Get('count')
	@HttpCode(200)
	@ResponseEnvelope('Friend requests count retrieved successfully')
	async getCount(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendRequestCountQuery,
	) {
		return this.service.countRequests(user.sub, query);
	}

	@Post()
	@HttpCode(201)
	@ResponseEnvelope('Friend request sent successfully')
	send(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendRequestAddDto,
	) {
		return this.service.sendRequest(user.sub, body.friendId);
	}

	@Patch(':friendId')
	@HttpCode(200)
	@ResponseEnvelope('Friend request accepted successfully')
	accept(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	) {
		return this.service.acceptRequest(user.sub, friendId);
	}

	@Delete(':friendId')
	@HttpCode(204)
	async delete(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	) {
		await this.service.removeRequest(user.sub, friendId);
	}
}

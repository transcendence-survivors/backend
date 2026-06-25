import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { BaseController } from '@/shared/base.controller';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Put,
	Query,
	Param,
	UseGuards,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { FriendQueryDto } from '../dto/friend-query.dto';
import { FriendAddDto } from '../dto/friend-add.dto';
import { FriendAcceptDto } from '../dto/friend-accept.dto';

@Controller('friends')
@UseGuards(JWTAccessGuard)
export class FriendController extends BaseController {
	constructor(private readonly service: FriendService) {
		super();
	}

	@HttpCode(200)
	@Get()
	async getFriends(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendQueryDto,
	) {
		const result = await this.service.findPage(user.sub, query);
		return this.ok(result, 'Friends retrieved successfully');
	}

	@HttpCode(201)
	@Post()
	async add(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendAddDto,
	) {
		const result = await this.service.create(user.sub, body.friendId);
		return this.ok(result, 'Friend request sent successfully');
	}

	@HttpCode(200)
	@Put()
	async accept(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendAcceptDto,
	) {
		const result = await this.service.accept(user.sub, body.friendId);
		return this.ok(result, 'Friend request accepted successfully');
	}

	@HttpCode(204)
	@Delete(':friendId')
	async remove(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	) {
		await this.service.remove(user.sub, friendId);
	}
}

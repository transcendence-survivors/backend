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

import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { FriendRequestPaginateDto } from '../dtos/requests/friend-request-paginate.dto';
import { FriendRequestCountDto } from '../dtos/requests/friend-count-paginate.dto';
import { FriendRequestAddDto } from '../dtos/requests/friend-request-add.dto';
import { FriendshipPaginatedResponseDto } from '../dtos/responses/friend-paginated-response.dto';
import { FriendshipCountResponseDto } from '../dtos/responses/friendship-count-response.dto';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { FriendRequestCreatedResponseDto } from '../dtos/responses/friend-request-created.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import {
	ApiFriendAlreadyExistsResponse,
	ApiFriendRequestAlreadySentResponse,
	ApiFriendRequestNotFoundResponse,
	ApiFriendRequestSelfAcceptResponse,
	ApiFriendshipBlockedByUserResponse,
	ApiFriendshipBlockedByYouResponse,
	ApiSelfFriendRequestDeleteResponse,
	ApiSelfFriendRequestSentResponse,
} from '../friend.decorators';

@Controller('friends/requests')
@UseGuards(JWTAccessGuard)
export class FriendRequestController {
	constructor(private readonly service: FriendService) {}

	@Get()
	@HttpCode(200)
	@ApiSuccessResponse(FriendshipPaginatedResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
		direction: ['direction must be either "incoming" or "outgoing"'],
	})
	@ResponseEnvelope('Friend requests retrieved successfully')
	async getCursorPage(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendRequestPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		return this.service.paginateRequest(user.sub, query);
	}

	@Get('count')
	@HttpCode(200)
	@ApiSuccessResponse(FriendshipCountResponseDto)
	@ApiValidationErrorResponse({
		direction: ['direction must be either "incoming" or "outgoing"'],
	})
	@ResponseEnvelope('Friend requests count retrieved successfully')
	async getCount(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendRequestCountDto,
	): Promise<FriendshipCountResponseDto> {
		return this.service.countRequests(user.sub, query);
	}

	@Post()
	@HttpCode(201)
	@ApiSuccessResponse(FriendRequestCreatedResponseDto)
	@ApiValidationErrorResponse({ friendId: ['friendId must be a string'] })
	@ApiSelfFriendRequestSentResponse()
	@ApiFriendshipBlockedByUserResponse()
	@ApiFriendshipBlockedByYouResponse()
	@ApiFriendAlreadyExistsResponse()
	@ApiFriendRequestAlreadySentResponse()
	@ResponseEnvelope('Friend request sent successfully')
	send(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendRequestAddDto,
	): Promise<FriendRequestCreatedResponseDto> {
		return this.service.sendRequest(user.sub, body.friendId);
	}

	@Patch(':friendId')
	@HttpCode(204)
	@ApiFriendRequestSelfAcceptResponse()
	@ApiFriendRequestNotFoundResponse()
	@ApiFriendAlreadyExistsResponse()
	@ResponseEnvelope('Friend request accepted successfully')
	async accept(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	): Promise<void> {
		await this.service.acceptRequest(user.sub, friendId);
	}

	@Delete(':friendId')
	@HttpCode(204)
	@ApiSelfFriendRequestDeleteResponse()
	@ApiFriendRequestNotFoundResponse()
	async delete(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	): Promise<void> {
		await this.service.removeRequest(user.sub, friendId);
	}
}

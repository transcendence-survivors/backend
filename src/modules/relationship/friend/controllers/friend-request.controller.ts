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
	HttpStatus,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';

import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { FriendRequestPaginateDto } from '../dtos/requests/friend-request-paginate.dto';
import { FriendRequestCountDto } from '../dtos/requests/friend-count-paginate.dto';
import { FriendRequestAddDto } from '../dtos/requests/friend-request-add.dto';
import { FriendshipPaginatedResponseDto } from '../dtos/responses/friend-paginated-response.dto';
import { FriendshipCountResponseDto } from '../dtos/responses/friendship-count-response.dto';
import {
	ApiCreatedSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ApiNoContentResponse, ApiParam } from '@nestjs/swagger';
import { RelationshipSearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { FriendShipListItemResponseDto } from '../dtos/responses/friendship-list-item-response.dto';
import { ApiGroupedErrorResponse } from '@/shared/decorators/api-error-response.decorator';
import { FriendRequestSelfAcceptException } from '../exceptions/friend-unprocessable.exception';
import {
	SelfFriendRequestDeleteException,
	SelfFriendRequestSentException,
} from '../exceptions/friend-bad.exception';
import {
	FriendshipBlockedByUserException,
	FriendshipBlockedByYouException,
} from '../exceptions/friend-forbidden.exception';
import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend-conflict.exception';
import { FriendRequestDoesNotExistException } from '../exceptions/friend-not-found.exception';

@Controller('friends/requests')
@UseGuards(JWTAccessGuard)
export class FriendRequestController {
	constructor(private readonly service: FriendService) {}

	@RelationshipSearchThrottle()
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(FriendRequestPaginateDto)
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

	@RelationshipSearchThrottle()
	@Get('count')
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(FriendRequestCountDto)
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
	@HttpCode(HttpStatus.CREATED)
	@ApiBodyDto(FriendRequestAddDto)
	@ApiCreatedSuccessResponse(FriendShipListItemResponseDto)
	@ApiValidationErrorResponse({ friendId: ['friendId must be a string'] })
	@ApiGroupedErrorResponse([SelfFriendRequestSentException])
	@ApiGroupedErrorResponse([
		FriendshipBlockedByUserException,
		FriendshipBlockedByYouException,
	])
	@ApiGroupedErrorResponse([
		FriendAlreadyExistsException,
		FriendRequestAlreadySentException,
	])
	@ResponseEnvelope('Friend request sent successfully')
	send(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendRequestAddDto,
	): Promise<FriendShipListItemResponseDto> {
		return this.service.sendRequest(user.sub, body.friendId);
	}

	@Patch(':friendId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({
		name: 'friendId',
		description: 'The UUID of the user to accept the friend request from',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		format: 'uuid',
	})
	@ApiNoContentResponse({
		description: 'Friend request accepted successfully',
	})
	@ApiGroupedErrorResponse([FriendRequestSelfAcceptException])
	@ApiGroupedErrorResponse([
		FriendshipBlockedByUserException,
		FriendshipBlockedByYouException,
	])
	@ApiGroupedErrorResponse([
		FriendAlreadyExistsException,
		FriendRequestAlreadySentException,
	])
	@ApiGroupedErrorResponse([FriendRequestDoesNotExistException])
	@ResponseEnvelope('Friend request accepted successfully')
	async accept(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	): Promise<void> {
		await this.service.acceptRequest(user.sub, friendId);
	}

	@Delete(':friendId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({
		name: 'friendId',
		description: 'The UUID of the user to delete the friend request for',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		format: 'uuid',
	})
	@ApiGroupedErrorResponse([SelfFriendRequestDeleteException])
	@ApiGroupedErrorResponse([FriendRequestDoesNotExistException])
	@ApiNoContentResponse({
		description: 'Friend request deleted successfully',
	})
	async delete(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	): Promise<void> {
		await this.service.removeRequest(user.sub, friendId);
	}
}

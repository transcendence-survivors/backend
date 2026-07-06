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
import { FriendshipPaginatedResponseDto } from '../dtos/responses/friend-paginated-response.dto';
import { FriendshipCountResponseDto } from '../dtos/responses/friendship-count-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import {
	ApiFriendNotFoundResponse,
	ApiSelfFriendDeleteResponse,
} from '../decorators/friend-api-errors.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ApiNoContentResponse, ApiParam } from '@nestjs/swagger';

@Controller('friends')
@UseGuards(JWTAccessGuard)
export class FriendController {
	constructor(private readonly service: FriendService) {}

	@Get()
	@HttpCode(200)
	@ApiQueryDto(FriendPaginateDto)
	@ApiSuccessResponse(FriendshipPaginatedResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
		direction: ['direction must be either "incoming" or "outgoing"'],
	})
	@ResponseEnvelope('Friends retrieved successfully')
	get(
		@CurrentUser() user: JwtAccessPayload,
		@Query() query: FriendPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		return this.service.paginateFriends(user.sub, query);
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(FriendCountDto)
	@ApiSuccessResponse(FriendshipCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Friends count retrieved successfully')
	count(
		@CurrentUser() user: JwtAccessPayload,
		@Query() { search }: FriendCountDto,
	): Promise<FriendshipCountResponseDto> {
		return this.service.countFriends(user.sub, search);
	}

	@Post('ids')
	@HttpCode(200)
	@ApiBodyDto(FriendIdsPaginateDto)
	@ApiSuccessResponse(FriendshipPaginatedResponseDto)
	@ApiValidationErrorResponse({
		friendIds: ['friendIds must be an array of strings'],
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
		direction: ['direction must be either "incoming" or "outgoing"'],
	})
	@ResponseEnvelope('Friends retrieved successfully')
	getFriendsByIds(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendIdsPaginateDto,
	): Promise<FriendshipPaginatedResponseDto> {
		return this.service.friendsCursorFromIds(user.sub, body);
	}

	@Post('ids/count')
	@HttpCode(200)
	@ApiBodyDto(FriendIdsCountDto)
	@ApiSuccessResponse(FriendshipCountResponseDto)
	@ApiValidationErrorResponse({
		friendIds: ['friendIds must be an array of strings'],
	})
	@ResponseEnvelope('Friends count retrieved successfully')
	countFriendsByIds(
		@CurrentUser() user: JwtAccessPayload,
		@Body() body: FriendIdsCountDto,
	): Promise<FriendshipCountResponseDto> {
		return this.service.countFriendsFromIds(user.sub, body);
	}

	@Delete(':friendId')
	@HttpCode(204)
	@ApiParam({
		name: 'friendId',
		description: 'The UUID of the user to remove from friends',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		format: 'uuid',
	})
	@ApiNoContentResponse({
		description: 'Friend removed successfully',
	})
	@ApiSelfFriendDeleteResponse()
	@ApiFriendNotFoundResponse()
	async remove(
		@CurrentUser() user: JwtAccessPayload,
		@Param('friendId') friendId: string,
	): Promise<void> {
		await this.service.removeFriend(user.sub, friendId);
	}
}

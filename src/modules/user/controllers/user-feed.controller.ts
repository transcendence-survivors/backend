import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';
import { UserFeedPaginateDto } from '../dtos/requests/user-feed-paginate.dto';
import { UserFeedCountDto } from '../dtos/requests/user-feed-count.dto';

@UseGuards(JWTAccessGuard)
@Controller('users/feed')
export class UserFeedController {
	constructor(private readonly userService: UserService) {}

	@SearchThrottle()
	@Get()
	@HttpCode(200)
	@ApiQueryDto(UserFeedPaginateDto)
	@ApiSuccessResponse(UserPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Users listed successfully')
	list(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserFeedPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		return this.userService.listUsers(query, { userId, feed: query.feed });
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(UserFeedCountDto)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
		feed: ['feed must be a valid enum value'],
	})
	@ResponseEnvelope('Users count retrieved successfully')
	count(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserFeedCountDto,
	): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query, { userId, feed: query.feed });
	}
}

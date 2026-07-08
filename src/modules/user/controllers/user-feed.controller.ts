import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { UserPaginateDto } from '../dtos/requests/user-paginate.dto';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';

@UseGuards(JWTAccessGuard)
@Controller('users/feed')
export class UserFeedController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JWTAccessGuard)
	@Get()
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Users listed successfully')
	listFeed(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		return this.userService.listUsers(query, { userId, feed: true });
	}

	@SearchThrottle()
	@UseGuards(JWTAccessGuard)
	@Get('not/count')
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Users count retrieved successfully')
	countFeed(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserPaginateDto,
	): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query, { userId, feed: true });
	}

	@UseGuards(JWTAccessGuard)
	@Get('not')
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Users listed successfully')
	listNotFeed(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		return this.userService.listUsers(query, { userId, feed: false });
	}

	@SearchThrottle()
	@UseGuards(JWTAccessGuard)
	@Get('not/count')
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Users count retrieved successfully')
	countNotFeed(
		@CurrentUser() { sub: userId }: JwtAccessPayload,
		@Query() query: UserPaginateDto,
	): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query, { userId, feed: false });
	}
}

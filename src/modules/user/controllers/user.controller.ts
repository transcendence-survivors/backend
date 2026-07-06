import { Controller, Get, Param, HttpCode, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { UserPaginateDto } from '../dtos/requests/user-paginate.dto';
import { UserProfileResponseDto } from '../dtos/responses/user-profile.dto';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';
import {
	ApiUserNotFoundResponse,
	ApiUsernameConflictResponse,
	ApiEmailConflictResponse,
} from '../decorators/user-api-errors.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiNoContentResponse, ApiParam } from '@nestjs/swagger';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Users listed successfully')
	list(
		@Query() query: UserPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		return this.userService.listUsers(query);
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(UserPaginateDto)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Users count retrieved successfully')
	count(@Query() query: UserPaginateDto): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query);
	}

	@Get('check-username/:username')
	@HttpCode(204)
	@ApiParam({
		name: 'username',
		description: 'The username to check for availability',
		example: 'johndoe',
		type: String,
	})
	@ApiUsernameConflictResponse()
	checkUsername(@Param('username') username: string): Promise<void> {
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	@HttpCode(204)
	@ApiParam({
		name: 'email',
		description: 'The email to check for availability',
		example: 'johndoe@example.com',
		type: String,
		format: 'email',
	})
	@ApiNoContentResponse({
		description: 'Email is available',
	})
	@ApiEmailConflictResponse()
	checkEmail(@Param('email') email: string): Promise<void> {
		return this.userService.checkEmailAvailability(email);
	}

	@Get(':username')
	@HttpCode(200)
	@ApiParam({
		name: 'username',
		description: 'The username to look up',
		example: 'johndoe',
	})
	@ApiSuccessResponse(UserProfileResponseDto)
	@ApiUserNotFoundResponse()
	@ResponseEnvelope('User found successfully')
	findProfile(
		@Param('username') username: string,
	): Promise<UserProfileResponseDto> {
		return this.userService.getProfile(username);
	}
}

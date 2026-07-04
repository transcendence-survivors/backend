import { Controller, Get, Param, HttpCode, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { UserPaginateDto } from '../dto/request/user-paginate.dto';
import { UserProfileResponseDto } from '../dto/response/user-profile.dto';
import { UserPaginatedListResponseDto } from '../dto/response/user-paginated-response.dto';
import { UserCountResponseDto } from '../dto/response/user-count-response.dto';
import {
	ApiUserNotFoundResponse,
	ApiUsernameConflictResponse,
	ApiEmailConflictResponse,
} from '../user.decorators';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@HttpCode(200)
	@ApiSuccessResponse(UserPaginatedListResponseDto)
	@ApiValidationErrorResponse()
	@ResponseEnvelope('Users listed successfully')
	list(
		@Query() query: UserPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		return this.userService.listUsers(query);
	}

	@Get('count')
	@HttpCode(200)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse()
	@ResponseEnvelope('Users count retrieved successfully')
	count(@Query() query: UserPaginateDto): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query);
	}

	@Get('check-username/:username')
	@HttpCode(204)
	@ApiUsernameConflictResponse()
	checkUsername(@Param('username') username: string): Promise<void> {
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	@HttpCode(204)
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

import {
	Controller,
	Get,
	Param,
	HttpCode,
	Query,
	Patch,
	HttpStatus,
	Body,
	UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { UserPaginateDto } from '../dtos/requests/user-paginate.dto';
import { UserProfileResponseDto } from '../dtos/responses/user-profile.dto';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiNoContentResponse, ApiParam } from '@nestjs/swagger';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { StorageService } from '@/core/storage/services/storage.service';
import { UserCountDto } from '../dtos/requests/user-count.dto';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { UserSettingsResponseDto } from '../dtos/responses/user-settings-response.dto';
import { ApiGroupedErrorResponse } from '@/shared/decorators/api-error-response.decorator';
import { UserSettingsUpdateEmptyException } from '../exceptions/user.bad.exception';
import { UserSettingsPatchDto } from '../dtos/requests/user-settings-patch.dto';
import { UserNotFoundException } from '../exceptions/user.not-found.exception';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly storageService: StorageService,
	) {}

	@SearchThrottle()
	@Get()
	@HttpCode(HttpStatus.OK)
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

	@SearchThrottle()
	@Get('count')
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(UserCountDto)
	@ApiSuccessResponse(UserCountResponseDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Users count retrieved successfully')
	count(@Query() query: UserCountDto): Promise<UserCountResponseDto> {
		return this.userService.countUsers(query);
	}

	@Get('check-username/:username')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({
		name: 'username',
		description: 'The username to check for availability',
		example: 'johndoe',
		type: String,
	})
	@ApiGroupedErrorResponse([UserUsernameConflictException])
	@ApiNoContentResponse({
		description: 'Username is available',
	})
	checkUsername(@Param('username') username: string): Promise<void> {
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	@HttpCode(HttpStatus.NO_CONTENT)
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
	@ApiGroupedErrorResponse([UserEmailConflictException])
	checkEmail(@Param('email') email: string): Promise<void> {
		return this.userService.checkEmailAvailability(email);
	}

	@Get('profile/:username')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		description: 'The username to look up',
		example: 'johndoe',
		type: String,
	})
	@ApiSuccessResponse(UserProfileResponseDto)
	@ApiGroupedErrorResponse([UserNotFoundException])
	@ResponseEnvelope('User found successfully')
	findProfile(
		@Param('username') username: string,
	): Promise<UserProfileResponseDto> {
		return this.userService.getProfile(username);
	}

	@UseGuards(JWTAccessGuard)
	@Get('me/settings')
	@HttpCode(HttpStatus.OK)
	@ApiSuccessResponse(UserSettingsResponseDto)
	@ApiGroupedErrorResponse([UserNotFoundException])
	@ResponseEnvelope('User settings retrieved successfully')
	getMySettings(
		@CurrentUser() user: JwtAccessPayload,
	): Promise<UserSettingsResponseDto> {
		return this.userService.getUserSettings(user.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Patch('me/settings')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiBodyDto(UserSettingsPatchDto)
	@ApiGroupedErrorResponse([UserSettingsUpdateEmptyException])
	@ApiGroupedErrorResponse([UserNotFoundException])
	@ApiNoContentResponse({ description: 'Settings successfully updated' })
	async updateMySettings(
		@CurrentUser() user: JwtAccessPayload,
		@Body() dto: UserSettingsPatchDto,
	): Promise<void> {
		await this.userService.updateUserSettings(user.sub, dto);
	}
}

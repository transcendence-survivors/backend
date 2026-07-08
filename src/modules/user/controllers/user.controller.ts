import {
	Controller,
	Get,
	Param,
	HttpCode,
	Query,
	UseGuards,
	Post,
	UseInterceptors,
	BadRequestException,
	UploadedFile,
} from '@nestjs/common';
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
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { StorageService } from '@/core/storage/services/storage.service';
import { UserCountDto } from '../dtos/requests/user-count.dto';

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly storageService: StorageService,
	) {}

	@SearchThrottle()
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

	@SearchThrottle()
	@Get('count')
	@HttpCode(200)
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

	@Get('profile/:username')
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

	@UseGuards(JWTAccessGuard)
	@Post('me/avatar')
	@UseInterceptors(
		FileInterceptor('file', {
			limits: { fileSize: 5 * 1024 * 1024 },
			fileFilter: (_req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					callback(
						new BadRequestException('File must be an image'),
						false,
					);
					return;
				}
				callback(null, true);
			},
		}),
	)
	@ResponseEnvelope('Avatar uploaded successfully')
	async uploadAvatar(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: JwtAccessPayload,
	) {
		const key = `avatars/${user.sub}-${Date.now()}${extname(file.originalname)}`;
		const url = await this.storageService.upload({
			fileName: key,
			body: file.buffer,
			contentType: file.mimetype,
			bucket: 'avatar',
		});
		return { url };
	}
}

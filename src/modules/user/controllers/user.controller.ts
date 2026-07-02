import {
	BadRequestException,
	Controller,
	Get,
	Delete,
	Param,
	Body,
	HttpCode,
	Query,
	Post,
	UseGuards,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UserService } from '../services/user.service';
import { BaseController } from '@/shared/base.controller';
import { UserQueryDto } from '../dto/user-query.dto';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { StorageService } from '@/core/storage/services/storage.service';

@Controller('users')
export class UserController extends BaseController {
	constructor(
		private readonly userService: UserService,
		private readonly storageService: StorageService,
	) {
		super();
	}

	@UseGuards(JWTAccessGuard)
	@Post('me/avatar')
	@UseInterceptors(
		FileInterceptor('file', {
			limits: { fileSize: 5 * 1024 * 1024 },
			fileFilter: (_req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					callback(new BadRequestException('File must be an image'), false);
					return;
				}
				callback(null, true);
			},
		}),
	)
	async uploadAvatar(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: JwtAccessPayload,
	) {
		const key = `avatars/${user.sub}-${Date.now()}${extname(file.originalname)}`;
		const url = await this.storageService.upload(
			key,
			file.buffer,
			file.mimetype,
		);
		return this.ok({ url }, 'Avatar uploaded');
	}

	@HttpCode(200)
	@Get(':username')
	async findOne(@Param('username') username: string) {
		const user = await this.userService.getSingle({ username });
		return this.ok(user, 'User found');
	}

	@Get()
	async getUsers(@Query() query: UserQueryDto) {
		const res = await this.userService.findPage(query);
		return this.ok(res, 'Users found');
	}

	@HttpCode(204)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.userService.delete(id);
	}

	@Get('check-username/:username')
	async checkUsername(@Param('username') username: string) {
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	async checkEmail(@Param('email') email: string) {
		return this.userService.checkEmailAvailability(email);
	}
}

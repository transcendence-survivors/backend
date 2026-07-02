import {
	Controller,
	Get,
	Delete,
	Param,
	HttpCode,
	Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserQueryDto } from '../dto/user-query.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':username')
	@HttpCode(200)
	@ResponseEnvelope('User found successfully')
	findOne(@Param('username') username: string) {
		return this.userService.getFacadeByUsername(username);
	}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Users found successfully')
	getUsers(@Query() query: UserQueryDto) {
		return this.userService.findPage(query);
	}

	@HttpCode(204)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.userService.delete(id);
	}

	@Get('check-username/:username')
	@HttpCode(200)
	@ResponseEnvelope('Username availability checked successfully')
	async checkUsername(@Param('username') username: string) {
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	@HttpCode(200)
	@ResponseEnvelope('Email availability checked successfully')
	async checkEmail(@Param('email') email: string) {
		return this.userService.checkEmailAvailability(email);
	}
}

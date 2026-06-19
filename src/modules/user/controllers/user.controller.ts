import { Controller, Get, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { BaseController } from '@/common/base.controller';

@Controller('users')
export class UserController extends BaseController {
	constructor(private readonly userService: UserService) {
		super();
	}

	@HttpCode(200)
	@Get(':username')
	async findOne(@Param('username') username: string) {
		const user = await this.userService.getSingle({ username });
		return this.ok(user, 'User found');
	}

	@HttpCode(204)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.userService.delete(id);
	}

	@Get('check-username/:username')
	async checkUsername(@Param('username') username: string) {
		console.log('Checking username:', username);
		return this.userService.checkUsernameAvailability(username);
	}

	@Get('check-email/:email')
	async checkEmail(@Param('email') email: string) {
		return this.userService.checkEmailAvailability(email);
	}
}

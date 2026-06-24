import {
	Controller,
	Get,
	Delete,
	Param,
	Body,
	HttpCode,
	Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { BaseController } from '@/common/base.controller';
import { UserQueryDto } from '../dto/user-query.dto';

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

	@Get()
	async getUsers(@Query() query: UserQueryDto) {
		const res = await this.userService.findPage(query);
		console.log(res);
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

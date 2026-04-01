import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '@/common/base.controller';
import { CreateUserDto, UpdateUserDto } from './dto/request.dto.';
import { UsernameDto } from './dto/fields.dto';

@Controller('users')
export class UserController extends BaseController {
	constructor(private readonly userService: UserService) {
		super();
	}

	@Get()
	async findAll() {
		const users = await this.userService.findAll();
		return this.ok(users, 'Users fetched');
	}

	@Get(':username')
	async findOne(@Param('username') username: UsernameDto['username']) {
		const user = await this.userService.findByUsername(username);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.ok(user, 'User fetched');
	}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		const existingUser = await this.userService.findByEmail(dto.email);
		if (existingUser) {
			throw new ConflictException('Email already in use');
		}

		const existingUsername = await this.userService.findByUsername(
			dto.username,
		);
		if (existingUsername) {
			throw new ConflictException('Username already in use');
		}

		const user = await this.userService.create(dto);
		return this.ok(user, 'User created');
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		const user = await this.userService.update(id, dto);
		return this.ok(user, 'User updated');
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.userService.delete(id);
		return this.ok(null, 'User deleted');
	}
}

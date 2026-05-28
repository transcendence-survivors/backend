import { Injectable } from '@nestjs/common';
import { UserEmail, UserUsername } from '../user.fields';
import CreateUserDto from '../dto/create.dto';
import { UserRepository } from '../repository/user.repository';
import FindParamException from '../exception/user.find-param.exception';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exception/user.conflict.exception';
import UserNotFoundException from '../exception/user.not-find.exception';

interface FindSingleParams {
	id?: string;
	email?: UserEmail;
	username?: UserUsername;
}

@Injectable()
export class UserService {
	constructor(private repository: UserRepository) {}

	async findSingle({ id, email, username }: FindSingleParams) {
		if (Object.keys({ id, email, username }).length === 0) {
			throw new FindParamException();
		}
		const user = await this.repository.findSingle({ id, email, username });
		if (!user) {
			throw new UserNotFoundException();
		}
		return user;
	}

	async delete(id: string) {
		await this.repository.delete(id);
	}

	async create(dto: CreateUserDto) {
		if (await this.repository.isByEmail(dto.email)) {
			throw new UserEmailConflictException();
		}
		if (await this.repository.isByUsername(dto.username)) {
			throw new UserUsernameConflictException();
		}

		const { password: _, ...userData } = dto;
		return this.repository.create({ ...userData });
	}
}

import { Injectable } from '@nestjs/common';
import { UserEmail, UserUsername } from '../user.decorators';
import CreateUserDto from '../dto/signup.dto';
import { UserRepository } from '../repositories/user.repository';
import FindParamException from '../exceptions/user.find-param.exception';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import UserNotFoundException from '../exceptions/user.not-find.exception';
import { Email } from '@/libs/types';

export interface UserFindSingleParams {
	id?: string;
	email?: UserEmail;
	username?: UserUsername;
}

@Injectable()
export class UserService {
	constructor(private repository: UserRepository) {}

	async getSingle({ id, email, username }: UserFindSingleParams) {
		if (Object.keys({ id, email, username }).length === 0) {
			throw new FindParamException();
		}
		const user = await this.findSingle({ id, email, username });
		if (!user) {
			throw new UserNotFoundException();
		}
		return user;
	}

	async delete(id: string) {
		await this.repository.delete(id);
	}

	async create(dto: Omit<CreateUserDto, 'password'>) {
		if (await this.repository.isByEmail(dto.email)) {
			throw new UserEmailConflictException();
		}
		if (await this.repository.isByUsername(dto.username)) {
			throw new UserUsernameConflictException();
		}
		return this.repository.create(dto);
	}

	async findSingle({ id, email, username }: UserFindSingleParams) {
		if (id) {
			return this.repository.findById(id);
		}
		if (email) {
			return this.repository.findByEmail(email);
		}
		if (username) {
			return this.repository.findByUsername(username);
		}
		return null;
	}

	async checkUsernameAvailability(username: string) {
		const exist = await this.repository.isByUsername(username);
		if (exist) {
			throw new UserUsernameConflictException();
		}
	}

	async checkEmailAvailability(email: Email) {
		const exist = await this.repository.isByEmail(email);
		if (exist) {
			throw new UserEmailConflictException();
		}
	}
}

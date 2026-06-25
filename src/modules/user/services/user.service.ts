import { Injectable } from '@nestjs/common';
import CreateUserDto from '../dto/user-create.dto';
import { UserRepository } from '../repositories/user.repository';
import FindParamException from '../exceptions/user.find-param.exception';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import UserNotFoundException from '../exceptions/user.not-found.exception';
import { UserQueryDto } from '../dto/user-query.dto';
import { PaginationService } from '@/shared/services/pagination.service';
import { IUserService } from '@/contracts/services/user-service.port';
import { DbContext } from '@/core/database/uow/db-context';

export interface UserFindSingleParams {
	id?: string;
	email?: string;
	username?: string;
}

@Injectable()
export class UserService implements IUserService {
	constructor(
		private readonly repo: UserRepository,
		private readonly pagination: PaginationService,
	) {}

	private findSingle({ id, email, username }: UserFindSingleParams) {
		if (id) return this.repo.findById(id);
		if (email) return this.repo.findByEmail(email);
		if (username) return this.repo.findByUsername(username);
		return null;
	}

	async findPage(query: UserQueryDto) {
		const { page, limit, orderBy } = query;
		const [data, total] = await this.repo.paginate(page, limit, orderBy);
		return this.pagination.create(data, page, limit, total);
	}
	async getSingle({ id, email, username }: UserFindSingleParams) {
		if (Object.keys({ id, email, username }).length === 0) {
			throw new FindParamException();
		}
		const user = await this.findSingle({ id, email, username });
		if (!user) throw new UserNotFoundException();
		return user;
	}

	async checkUsernameAvailability(username: string) {
		const exist = await this.repo.findIdByUsername(username);
		if (exist) throw new UserUsernameConflictException();
	}
	async checkEmailAvailability(email: string) {
		const exist = await this.repo.findIdByEmail(email);
		if (exist) throw new UserEmailConflictException();
	}

	async createUser(input: CreateUserDto, ctx?: DbContext) {
		const existing = await this.repo.isConflict(
			input.email,
			input.username,
			ctx,
		);
		if (existing?.email === input.email)
			throw new UserEmailConflictException();
		if (existing?.username === input.username)
			throw new UserUsernameConflictException();
		return this.repo.save(input, ctx);
	}
	getTokenData(userId: string, ctx?: DbContext) {
		return this.repo.getTokenData(userId, ctx);
	}
	async getLocalPreferenceByEmail(email: string, ctx?: DbContext) {
		const user = await this.repo.getLocalPreferenceByEmail(email, ctx);
		if (!user) throw new UserNotFoundException();
		return user;
	}

	async validateUserId(userId: string, ctx?: DbContext) {
		const user = await this.repo.isByUserId(userId, ctx);
		if (!user) throw new UserNotFoundException();
	}

	async delete(id: string) {
		await this.repo.delete(id);
	}
}

import { Injectable } from '@nestjs/common';
import UserCreateDto from '../dto/request/user-create.dto';
import { UserRepository } from '../repositories/user.repository';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import { IUserService } from '@/contracts/services/user/user-service.port';
import { DbContext } from '@/core/database/uow/db-context';
import { CursorService } from '@/shared/services/cursor.service';
import { UserMapper } from '../mappers/user.mapper';
import { UserPaginateDto } from '../dto/request/user-paginate.dto';
import { UserPaginatedListResponseDto } from '../dto/response/user-paginated-response.dto';
import { UserProfileResponseDto } from '../dto/response/user-profile.dto';
import { UserCountResponseDto } from '../dto/response/user-count-response.dto';
import { UserTokenData } from '../types/records/user-token-data.type';
import { UserLocalePreference } from '../types/records/user-locale-preference.type';
import { UserCreated } from '../types/records/user-created.type';
import { UserNotFoundException } from '../exceptions/user.not-found.exception';

@Injectable()
export class UserService implements IUserService {
	constructor(
		private readonly repo: UserRepository,
		private readonly cursor: CursorService,
		private readonly mapper: UserMapper,
	) {}

	public getTokenData(
		userId: string,
		ctx?: DbContext,
	): Promise<UserTokenData | null> {
		return this.repo.getTokenData(userId, ctx);
	}
	public async getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<UserLocalePreference | null> {
		const user = await this.repo.getLocalPreferenceByEmail(email, ctx);
		if (!user) throw new UserNotFoundException();
		return user;
	}
	public async createUser(
		input: UserCreateDto,
		ctx?: DbContext,
	): Promise<UserCreated> {
		const existing = await this.repo.findByEmailOrUsername(
			{ email: input.email, username: input.username },
			ctx,
		);
		if (existing?.email === input.email)
			throw new UserEmailConflictException();
		if (existing?.username === input.username)
			throw new UserUsernameConflictException();
		return this.repo.save(
			{
				birthDate: input.dateOfBirth,
				email: input.email,
				username: input.username,
				displayName: input.displayName,
				firstName: input.firstName,
				lastName: input.lastName,
				bio: input.bio,
				gender: input.gender,
				localePreference: input.localePreference,
			},
			ctx,
		);
	}
	public async validateUserId(
		userId: string,
		ctx?: DbContext,
	): Promise<void> {
		const user = await this.repo.isByUserId(userId, ctx);
		if (!user) throw new UserNotFoundException();
	}

	async listUsers(
		dto: UserPaginateDto,
	): Promise<UserPaginatedListResponseDto> {
		const users = await this.repo.cursor({
			limit: dto.limit,
			cursor: dto.cursor,
			search: dto.search,
			orderBy: dto.orderBy,
		});

		const dtos = this.mapper.toListItemDtoList(users);
		const result = this.cursor.create(dtos, dto.limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}

	async countUsers(dto: UserPaginateDto): Promise<UserCountResponseDto> {
		const count = await this.repo.cursorCount({
			search: dto.search,
		});
		return this.mapper.toCountDto(count);
	}

	async getProfile(username: string): Promise<UserProfileResponseDto> {
		const user = await this.repo.profileByUsername(username);
		if (!user) throw new UserNotFoundException();

		return this.mapper.toProfileDto(user);
	}

	async checkUsernameAvailability(username: string): Promise<void> {
		const exist = await this.repo.isByUsername(username);
		if (exist) throw new UserUsernameConflictException();
	}
	async checkEmailAvailability(email: string): Promise<void> {
		const exist = await this.repo.isByEmail(email);
		if (exist) throw new UserEmailConflictException();
	}

	delete(id: string): Promise<void> {
		return this.repo.delete(id);
	}
}

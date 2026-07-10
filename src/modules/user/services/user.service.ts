import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import { IUserService } from '@/contracts/services/user/user-service.port';
import { DbContext } from '@/core/database/uow/db-context';
import { CursorService } from '@/shared/services/cursor.service';
import { UserMapper } from '../mappers/user.mapper';
import { UserPaginateDto } from '../dtos/requests/user-paginate.dto';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { UserProfileResponseDto } from '../dtos/responses/user-profile.dto';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';
import { AuhtUserData } from '@/contracts/types/user/user-token-data.type';
import { UserLocalePreference } from '../types/records/user-locale-preference.type';
import { UserCreated } from '../types/records/user-created.type';
import { UserNotFoundException } from '../exceptions/user.not-found.exception';
import { UserCreateParams } from '@/contracts/types/user/user-create.params';
import { UsersCursorParams } from '../types/params/user-cursor.params';
import { UsersCountParams } from '../types/params/user-count.params';
import { UserCountDto } from '../dtos/requests/user-count.dto';

@Injectable()
export class UserService implements IUserService {
	constructor(
		private readonly repo: UserRepository,
		private readonly cursor: CursorService,
		private readonly mapper: UserMapper,
	) {}

	public getCountIn(ids: string[], ctx?: DbContext): Promise<number> {
		return this.repo.getCountIn(ids, ctx);
	}

	public getAuthData(
		userId: string,
		ctx?: DbContext,
	): Promise<AuhtUserData | null> {
		return this.repo.getAuthData(userId, ctx);
	}
	public async getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<UserLocalePreference | null> {
		const user = await this.repo.getLocalPreferenceByEmail(email, ctx);
		if (!user) throw new UserNotFoundException();
		return user;
	}
	public async createUserOrThrow(
		input: UserCreateParams,
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
				birthDate: input.birthDate,
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
		feedParams?: UsersCursorParams['feedParams'],
	): Promise<UserPaginatedListResponseDto> {
		const users = await this.repo.cursor({
			limit: dto.limit,
			cursor: dto.cursor,
			search: dto.search,
			orderBy: dto.orderBy,
			feedParams,
		});

		const dtos = this.mapper.toListItemDtoList(users);
		const result = this.cursor.create(dtos, dto.limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}

	async countUsers(
		dto: UserCountDto,
		feedParams?: UsersCountParams['feedParams'],
	): Promise<UserCountResponseDto> {
		const count = await this.repo.cursorCount({
			search: dto.search,
			feedParams,
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

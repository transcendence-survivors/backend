import { Injectable } from '@nestjs/common';
import { AuthProviderRepository } from '../repositories/auth-provider.repository';
import { compare, hash } from 'bcrypt';
import { DbContext } from '@/core/database/uow/db-context';
import type { AuthProviderLocaleCreated } from '../types/records/auth-provider-locale-created.type';
import type { AuthProviderId } from '../types/records/auth-provider-id.type';
import type { AuthProviderUser } from '../types/records/auth-provider-user.type';
import { AuthProviderCredentialsException } from '../exceptions/auth-provider-credentials.exception';

@Injectable()
export class LocalAuthProviderService {
	private readonly SALT = 10;

	constructor(private readonly providerRepo: AuthProviderRepository) {}

	async validate(
		usernameOrEmail: string,
		password: string,
	): Promise<AuthProviderUser> {
		const provider =
			await this.providerRepo.findLocaleByUsernameOrEmail(
				usernameOrEmail,
			);
		if (!provider?.password) throw new AuthProviderCredentialsException();

		const ok = await compare(password, provider.password);
		if (!ok) throw new AuthProviderCredentialsException();

		return provider.user;
	}

	async create(
		userId: string,
		password: string,
		ctx: DbContext,
	): Promise<AuthProviderLocaleCreated> {
		const hash = await this.hashPassword(password);
		return this.providerRepo.createLocale({ hash, userId }, ctx);
	}

	async updatePassword(
		userId: string,
		password: string,
		ctx: DbContext,
	): Promise<AuthProviderId> {
		const newPasswordHash = await this.hashPassword(password);
		return this.providerRepo.updateLocalePassword(
			{ userId, newPasswordHash },
			ctx,
		);
	}

	private hashPassword(password: string): Promise<string> {
		return hash(password, this.SALT);
	}
}

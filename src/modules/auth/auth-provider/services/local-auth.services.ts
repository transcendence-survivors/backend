import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProviderRepository } from '../repositories/provider.repository';
import { compare, hash } from 'bcrypt';
import { DbContext } from '@/core/database/uow/db-context';

@Injectable()
export class LocalAuthProviderService {
	private readonly SALT = 10;
	constructor(private readonly providerRepo: AuthProviderRepository) {}

	async validate(usernameOrEmail: string, password: string) {
		const provider =
			await this.providerRepo.findLocaleByUsernameOrEmail(
				usernameOrEmail,
			);
		if (!provider?.password) throw new UnauthorizedException();

		const ok = await compare(password, provider.password);
		if (!ok) throw new UnauthorizedException();
		return provider;
	}

	async create(userId: string, password: string, ctx: DbContext) {
		const hashed = await this.hashPassword(password);
		return this.providerRepo.createLocale(hashed, userId, ctx);
	}

	async updatePassword(userId: string, password: string, ctx: DbContext) {
		const hashed = await this.hashPassword(password);
		return this.providerRepo.updateLocalePassword(userId, hashed, ctx);
	}

	private hashPassword(password: string) {
		return hash(password, this.SALT);
	}
}

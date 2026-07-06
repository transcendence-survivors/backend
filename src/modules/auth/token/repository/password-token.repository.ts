import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { PasswordTokenQueryHelper } from './password-token-query.helper';
import type { ResetPasswordTokenSelect } from '@prisma-generated/models';
import type { PasswordTokenCreateParams } from '../types/params/password-token-create.params';
import type { PasswordTokenCreated } from '../types/records/password-token-created.type';
import type { PasswordTokenByHash } from '../types/records/password-token-by-hash.type';
import type { PasswordTokenUsed } from '../types/records/password-token-used.type';

@Injectable()
export class PasswordTokenRepository {
	private static readonly select = {
		id: true,
	} satisfies Record<
		keyof PasswordTokenCreated,
		ResetPasswordTokenSelect[keyof PasswordTokenCreated]
	>;

	constructor(private readonly prisma: PrismaService) {}

	save(
		{ hashedToken, userId, expireInMs }: PasswordTokenCreateParams,
		ctx?: DbContext,
	): Promise<PasswordTokenCreated> {
		return (ctx?.client ?? this.prisma).resetPasswordToken.create({
			data: {
				tokenHash: hashedToken,
				userId: userId,
				expiresAt: PasswordTokenQueryHelper.expirationDate(expireInMs),
			},
			select: {
				...PasswordTokenRepository.select,
			} satisfies Record<
				keyof PasswordTokenCreated,
				ResetPasswordTokenSelect[keyof PasswordTokenCreated]
			>,
		});
	}

	getByHashToken(
		tokenHash: string,
		ctx?: DbContext,
	): Promise<PasswordTokenByHash | null> {
		return (ctx?.client ?? this.prisma).resetPasswordToken.findFirst({
			where: PasswordTokenQueryHelper.activeTokenWhere(tokenHash),
			select: {
				id: true,
				userId: true,
			} satisfies Record<
				keyof PasswordTokenByHash,
				ResetPasswordTokenSelect[keyof PasswordTokenByHash]
			>,
		});
	}

	invalidates(userId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).resetPasswordToken.updateMany({
			where: {
				userId,
				used: false,
			},
			data: {
				used: true,
			},
		});
	}

	use(id: string, ctx?: DbContext): Promise<PasswordTokenUsed> {
		return (ctx?.client ?? this.prisma).resetPasswordToken.update({
			where: { id },
			data: { used: true },
			select: {
				...PasswordTokenRepository.select,
			} satisfies Record<
				keyof PasswordTokenUsed,
				ResetPasswordTokenSelect[keyof PasswordTokenUsed]
			>,
		});
	}
}

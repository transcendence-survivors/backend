import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import type { RefreshTokenSelect } from '@prisma-generated/models';
import { msFromNow } from '@/shared/utils/date.util';
import { RefreshTokenCreateParams } from '../types/params/refresh-token-create.params';
import { RefreshTokenId } from '../types/records/refresh-token-id.type';
import { RefreshTokenStatus } from '../types/records/refresh-token-status.type';

@Injectable()
export class RefreshTokenRepository {
	private static readonly idSelect = {
		id: true,
	} satisfies Record<
		keyof RefreshTokenId,
		RefreshTokenSelect[keyof RefreshTokenId]
	>;

	constructor(private readonly prisma: PrismaService) {}

	save(
		{ hashedToken, expireInMs, userId, meta }: RefreshTokenCreateParams,
		ctx?: DbContext,
	): Promise<RefreshTokenId> {
		return (ctx?.client ?? this.prisma).refreshToken.create({
			data: {
				hashToken: hashedToken,
				expiredAt: msFromNow(expireInMs),
				userId,
				...meta,
			},
			select: {
				...RefreshTokenRepository.idSelect,
			},
		});
	}

	get(
		hashToken: string,
		userId: string,
		ctx?: DbContext,
	): Promise<RefreshTokenStatus | null> {
		return (ctx?.client ?? this.prisma).refreshToken.findUnique({
			where: {
				hashToken,
				userId,
			},
			select: {
				expiredAt: true,
				isRevoked: true,
			} satisfies Record<
				keyof RefreshTokenStatus,
				RefreshTokenSelect[keyof RefreshTokenStatus]
			>,
		});
	}

	revoke(hashToken: string, ctx?: DbContext): Promise<RefreshTokenId> {
		return (ctx?.client ?? this.prisma).refreshToken.update({
			where: {
				hashToken,
			},
			data: {
				isRevoked: true,
			},
			select: RefreshTokenRepository.idSelect,
		});
	}

	revokeUser(userId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).refreshToken.updateMany({
			where: {
				userId,
			},
			data: {
				isRevoked: true,
			},
		});
	}
}

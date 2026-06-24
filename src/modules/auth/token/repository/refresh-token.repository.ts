import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';

interface RefreshTokenSave {
	hashedToken: string;
	expireInMs: number;
	userId: string;
	meta?: {
		userAgent: string;
		ip: string;
		deviceId: string;
	};
}

@Injectable()
export class RefreshTokenRepository {
	constructor(private prisma: PrismaService) {}

	save(
		{ hashedToken, expireInMs, userId, meta }: RefreshTokenSave,
		ctx?: DbContext,
	) {
		const expirationDate = new Date(Date.now() + expireInMs);
		return (ctx?.client ?? this.prisma).refreshToken.create({
			data: {
				hashToken: hashedToken,
				expiredAt: expirationDate,
				userId,
				...meta,
			},
			select: {
				id: true,
			},
		});
	}

	get(hashToken: string, userId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).refreshToken.findUnique({
			where: {
				hashToken,
				userId,
			},
			select: {
				expiredAt: true,
				isRevoked: true,
			},
		});
	}

	revoke(hashToken: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).refreshToken.update({
			where: {
				hashToken,
			},
			data: {
				isRevoked: true,
			},
			select: {
				id: true,
			},
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

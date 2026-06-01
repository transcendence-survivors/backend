import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';

interface TokenSave {
	hashedToken: string;
	expireInMs: number;
	familyId?: string;
	userId: string;
	meta?: {
		userAgent: string;
		ip: string;
		deviceId: string;
	};
}

@Injectable()
export class TokenRepository {
	constructor(private prisma: PrismaService) {}

	async save({ hashedToken, expireInMs, userId, familyId, meta }: TokenSave) {
		const expirationDate = new Date(Date.now() + expireInMs);
		return this.prisma.refreshToken.create({
			data: {
				hashToken: hashedToken,
				expiredAt: expirationDate,
				familyId,
				userId,
				...meta,
			},
		});
	}

	hasRefreshToken(hashToken: string, userId: string) {
		return this.prisma.refreshToken.findUnique({
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

	revokeToken(hashToken: string) {
		return this.prisma.refreshToken.update({
			where: {
				hashToken,
			},
			data: {
				isRevoked: true,
			},
		});
	}
}

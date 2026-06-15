import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

interface RefreshTokenSave {
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
export class RefreshTokenRepository {
	constructor(private prisma: PrismaService) {}

	save({
		hashedToken,
		expireInMs,
		userId,
		familyId,
		meta,
	}: RefreshTokenSave) {
		const expirationDate = new Date(Date.now() + expireInMs);
		return this.prisma.refreshToken.create({
			data: {
				hashToken: hashedToken,
				expiredAt: expirationDate,
				familyId,
				userId,
				...meta,
			},
			select: {
				id: true,
			},
		});
	}

	get(hashToken: string, userId: string) {
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

	revoke(hashToken: string) {
		return this.prisma.refreshToken.update({
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

	revokeUser(userId: string) {
		return this.prisma.refreshToken.updateMany({
			where: {
				userId,
			},
			data: {
				isRevoked: true,
			},
		});
	}
}

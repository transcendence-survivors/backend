import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';

interface PasswordTokenSave {
	hashedToken: string;
	userId: string;
	expireInMs: number;
}

@Injectable()
export class PasswordTokenRepository {
	constructor(private prisma: PrismaService) {}

	save(
		{ hashedToken, userId, expireInMs }: PasswordTokenSave,
		ctx?: DbContext,
	) {
		const expirationDate = new Date(Date.now() + expireInMs);

		return (ctx?.client || this.prisma).resetPasswordToken.create({
			data: {
				tokenHash: hashedToken,
				userId: userId,
				expiresAt: expirationDate,
			},
			select: {
				id: true,
			},
		});
	}

	getByHashToken(tokenHash: string, ctx?: DbContext) {
		return (ctx?.client || this.prisma).resetPasswordToken.findFirst({
			where: {
				tokenHash,
				used: false,
				expiresAt: {
					gte: new Date(),
				},
			},
			select: {
				id: true,
				userId: true,
			},
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

	use(id: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).resetPasswordToken.update({
			where: {
				id,
			},
			data: {
				used: true,
			},
			select: {
				id: true,
			},
		});
	}
}

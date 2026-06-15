import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

interface PasswordTokenSave {
	hashedToken: string;
	userId: string;
	expireInMs: number;
}

@Injectable()
export class PasswordTokenRepository {
	constructor(private prisma: PrismaService) {}

	save({ hashedToken, userId, expireInMs }: PasswordTokenSave) {
		const expirationDate = new Date(Date.now() + expireInMs);

		return this.prisma.resetPasswordToken.create({
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

	getByHashToken(tokenHash: string) {
		return this.prisma.resetPasswordToken.findFirst({
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

	invalidates(userId: string) {
		return this.prisma.resetPasswordToken.updateMany({
			where: {
				userId,
				used: false,
			},
			data: {
				used: true,
			},
		});
	}

	use(id: string) {
		return this.prisma.resetPasswordToken.update({
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

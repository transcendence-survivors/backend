import { PrismaService } from '@/common/prisma.service';
import { UserPassword } from '@/modules/user/user.fields';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderRepository {
	constructor(private readonly prisma: PrismaService) {}

	private readonly selectLocale = {
		password: true,
		userId: true,
	} satisfies Record<string, boolean>;

	createLocale(hash: UserPassword, userId: string) {
		return this.prisma.authProvider.create({
			data: {
				provider: 'LOCAL',
				password: hash,
				userId: userId,
			},
			select: {
				...this.selectLocale,
			},
		});
	}

	findLocaleByUserId(userId: string) {
		return this.prisma.authProvider.findFirst({
			where: {
				provider: 'LOCAL',
				userId: userId,
			},
			select: {
				...this.selectLocale,
			},
		});
	}
}

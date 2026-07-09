import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { PresenceUpdateParams } from '../types/params/presence-update.params';
import { UserQueryHelper } from '@/modules/user/user.public-api';

@Injectable()
export class PresenceRepository {
	constructor(private readonly prisma: PrismaService) {}

	getPresenceStatus(userId: string, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.user.findUnique({
			where: { id: userId },
			select: {
				...UserQueryHelper.userSelect,
				preferedPresenceStatus: true,
			},
		});
	}

	updateStatus({ userId, status }: PresenceUpdateParams, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.user.update({
			where: { id: userId },
			data: { preferedPresenceStatus: status },
			select: {
				...UserQueryHelper.userSelect,
			},
		});
	}

	disconnectUser(userId: string, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.user.update({
			where: { id: userId },
			data: { lastActiveAt: new Date() },
		});
	}
}

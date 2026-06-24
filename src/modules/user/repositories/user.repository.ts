import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { User, UserStats } from '@prisma-generated/client';
import { UserOrderByWithRelationInput } from '@prisma-generated/internal/prismaNamespaceBrowser';
import { DbContext } from '@/core/database/uow/db-context';
import CreateUserDto from '../dto/user-create.dto';

export const USER_ORDER_BY = [
	'date-asc',
	'date-desc',
	'username-asc',
	'username-desc',
] as const;

export type OrderBy = (typeof USER_ORDER_BY)[number];

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	private readonly userStatsSelect = {
		postCount: true,
		likesGiven: true,
		likesReceived: true,
		followerCount: true,
		followingCount: true,
	} satisfies Partial<Record<keyof UserStats, boolean>>;

	private readonly userSelect = {
		id: true,
		username: true,
		displayName: true,
		avatarUrl: true,
	} satisfies Partial<Record<keyof User, boolean>>;

	private readonly orderByMapping: Record<
		OrderBy,
		UserOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
		'username-asc': { username: 'asc' },
		'username-desc': { username: 'desc' },
	};

	async findPage(page: number, limit: number, orderBy?: OrderBy) {
		const skip = (page - 1) * limit;

		return this.prisma.$transaction(async (tx) => {
			const [data, total] = await Promise.all([
				tx.user.findMany({
					skip,
					take: limit,
					orderBy: orderBy ? this.orderByMapping[orderBy] : undefined,
					select: this.userSelect,
				}),
				tx.user.count(),
			]);

			return { data, total };
		});
	}

	findById(id: string, selectStats = false) {
		const statsSelect = selectStats
			? { select: this.userStatsSelect }
			: undefined;

		return this.prisma.user.findUnique({
			where: { id },
			select: {
				...this.userSelect,
				bio: true,
				coverImageUrl: true,
				birthDate: true,
				localePreference: true,
				stats: statsSelect,
			},
		});
	}

	findByEmail(email: string, selectStats = false) {
		const statsSelect = selectStats
			? { select: this.userStatsSelect }
			: undefined;

		return this.prisma.user.findUnique({
			where: { email },
			select: {
				...this.userSelect,
				stats: statsSelect,
			},
		});
	}
	findByUsername(username: string, selectStats = false) {
		const statsSelect = selectStats
			? { select: this.userStatsSelect }
			: undefined;

		return this.prisma.user.findUnique({
			where: { username },
			select: {
				...this.userSelect,
				stats: statsSelect,
			},
		});
	}

	async delete(id: string, ctx?: DbContext) {
		await (ctx?.client ?? this.prisma).user.delete({ where: { id } });
	}
	async isByEmail(email: string, ctx?: DbContext): Promise<boolean> {
		const exist = await (ctx?.client ?? this.prisma).user.findFirst({
			where: { email },
		});
		return exist !== null;
	}
	async isByUsername(username: string, ctx?: DbContext): Promise<boolean> {
		const exist = await (ctx?.client ?? this.prisma).user.findFirst({
			where: { username },
		});
		return exist !== null;
	}

	isConflict(email: string, username: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
			select: {
				email: true,
				username: true,
			},
		});
	}

	save(data: CreateUserDto, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).user.create({
			data: {
				birthDate: data.dateOfBirth,
				email: data.email,
				firstName: data.firstName,
				displayName: data.displayName,
				bio: data.bio,
				lastName: data.lastName,
				username: data.username,
				gender: data.gender,
				localePreference: data.localePreference,
				stats: {
					create: {},
				},
			},
			select: {
				...this.userSelect,
				email: true,
				role: true,
			},
		});
	}
	getTokenData(userId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
			},
		});
	}
	getLocalPreferenceByEmail(email: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).user.findUnique({
			where: { email },
			select: {
				localePreference: true,
				id: true,
			},
		});
	}
}

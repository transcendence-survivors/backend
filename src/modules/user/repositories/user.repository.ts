import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import CreateUserDto from '../../auth/dto/signup.dto';
import { User, UserStats } from '@prisma-generated/client';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	private userStatsSelect = {
		postCount: true,
		likesGiven: true,
		likesReceived: true,
		followerCount: true,
		followingCount: true,
	} satisfies Partial<Record<keyof UserStats, boolean>>;

	private userSelect = {
		id: true,
		username: true,
		displayName: true,
		avatarUrl: true,
		role: true,
	} satisfies Partial<Record<keyof User, boolean>>;

	save(data: Omit<CreateUserDto, 'password'>) {
		return this.prisma.user.create({
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
			},
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

	getTokenData(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				role: true,
				email: true,
				username: true,
			},
		});
	}

	getIdByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			select: { localePreference: true, id: true },
		});
	}

	async delete(id: string) {
		await this.prisma.user.delete({ where: { id } });
	}

	async isByEmail(email: string): Promise<boolean> {
		const count = await this.prisma.user.count({ where: { email } });
		return count > 0;
	}

	async isByUsername(username: string): Promise<boolean> {
		const count = await this.prisma.user.count({ where: { username } });
		return count > 0;
	}

	isConflict(email: string, username: string) {
		return this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
			select: {
				email: true,
				username: true,
			},
		});
	}
}

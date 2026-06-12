import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';
import CreateUserDto from '../dto/signup.dto';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	private userStatsSelect = {
		postCount: true,
		likesGiven: true,
		likesReceived: true,
		followerCount: true,
		followingCount: true,
	};

	private userSelect = {
		id: true,
		email: true,
		username: true,
		displayName: true,
		firstName: true,
		lastName: true,
		role: true,
	};

	async findById(id: string, selectStats = false) {
		const statsSelect = selectStats
			? { select: this.userStatsSelect }
			: undefined;

		return this.prisma.user.findUnique({
			where: { id },
			select: {
				...this.userSelect,
				stats: statsSelect,
			},
		});
	}

	async findByEmail(email: string, selectStats = false) {
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
	async findByUsername(username: string, selectStats = false) {
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

	async getTokenData(id: string) {
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

	async create(data: Omit<CreateUserDto, 'password'>) {
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
				stats: {
					create: {},
				},
			},
			select: this.userSelect,
		});
	}

	async delete(id: string): Promise<void> {
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
}

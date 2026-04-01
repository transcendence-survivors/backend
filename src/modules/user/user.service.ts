import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/request.dto.';
import { EmailDto, UsernameDto } from './dto/fields.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async findById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async findByEmail(email: EmailDto['email']) {
		return this.prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async findByUsername(username: UsernameDto['username']) {
		return this.prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async create(data: CreateUserDto) {
		const { password, ...rest } = data;

		return this.prisma.user.create({
			data: rest,
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async update(id: string, data: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
			},
		});
	}

	async delete(id: string) {
		return this.prisma.user.delete({
			where: { id },
		});
	}
}

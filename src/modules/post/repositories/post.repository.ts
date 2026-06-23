import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
	constructor(private readonly prisma: PrismaService) {}
	async findAll() {
		return this.prisma.post.findMany();
	}
}

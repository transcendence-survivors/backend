import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';

@Injectable()
export class PostRepository {
	constructor(private readonly prisma: PrismaService) {}
	findAll() {
		return this.prisma.post.findMany();
	}

	create(userId: string, dto: CreatePostDto) {
		return this.prisma.post.create({
			data: {
				authorId: userId,
				content: dto.content,
			},
		});
	}
}

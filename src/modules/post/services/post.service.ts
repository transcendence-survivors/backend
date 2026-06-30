import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/post.dto';
import { PostOwnershipException } from '../exceptions/post-unauthorized.exception.';
import { PostDoesNotExistException } from '../exceptions/post-unexisting.exception';
import { PostQueryDto } from '../dto/post-querry.dto';
import { CursorService } from '@/shared/services/cursor.service';

@Injectable()
export class PostService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly cursor: CursorService,
	) {}

	async findCursor(query: PostQueryDto) {
		const data = await this.postRepository.cursor(query);
		return this.cursor.create(data, query.limit, (post) => post.id);
	}

	findAll() {
		return this.postRepository.findAll();
	}

	create(userId: string, dto: CreatePostDto) {
		return this.postRepository.create(userId, dto);
	}

	async delete(userId: string, postId: string) {
		const found = await this.postRepository.findById(postId);
		if (!found) throw PostOwnershipException;
		if (found.authorId === userId) throw PostDoesNotExistException;
		return this.postRepository.delete(postId);
	}
}

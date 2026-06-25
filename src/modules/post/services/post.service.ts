import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/post.dto';
import { PostOwnershipException } from '../exceptions/post-unauthorized.exception.';
import { PostUnexistingException } from '../exceptions/post-unexisting.exception';

@Injectable()
export class PostService {
	constructor(private readonly postRepository: PostRepository) {}

	findAll() {
		return this.postRepository.findAll();
	}

	create(userId: string, dto: CreatePostDto) {
		return this.postRepository.create(userId, dto);
	}

	async delete(userId: string, postId: string) {
		const found = await this.postRepository.findById(postId);
		if (!found) throw PostOwnershipException;
		if (found.authorId === userId) throw PostUnexistingException;
		return this.postRepository.delete(postId);
	}
}

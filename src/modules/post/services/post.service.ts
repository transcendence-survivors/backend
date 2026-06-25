import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/post.dto';

@Injectable()
export class PostService {
	constructor(private readonly postRepository: PostRepository) {}

	findAll() {
		return this.postRepository.findAll();
	}

	create(userId: string, dto: CreatePostDto) {
		return this.postRepository.create(userId, dto);
	}
}

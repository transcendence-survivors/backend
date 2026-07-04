import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/post.dto';
import { PostOwnershipException } from '../exceptions/post-unauthorized.exception.';
import { PostDoesNotExistException } from '../exceptions/post-unexisting.exception';
import { PostQueryDto } from '../dto/post-querry.dto';
import { PaginationService } from '@/shared/services/pagination.service';
import { StorageService } from '@/core/storage/services/storage.service';

@Injectable()
export class PostService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly pagination: PaginationService,
		private readonly storageService: StorageService,
	) {}

	async findPage(query: PostQueryDto) {
		const { page, limit, orderBy } = query;
		const [data, total] = await this.postRepository.paginate(
			page,
			limit,
			orderBy,
		);
		return this.pagination.create(data, page, limit, total);
	}

	findAll() {
		return this.postRepository.findAll();
	}

	create(userId: string, dto: CreatePostDto, imageUrl?: string) {
		return this.postRepository.create(userId, dto, imageUrl);
	}

	async delete(postId: string, userId: string) {
		const found = await this.postRepository.findById(postId);
		if (!found) throw new PostDoesNotExistException();
		if (found.authorId !== userId) throw new PostOwnershipException();
		if (found.imageUrl) {
			await this.storageService.delete(found.imageUrl);
		}
		return this.postRepository.delete(postId);
	}
}

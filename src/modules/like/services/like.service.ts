import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';

@Injectable()
export class LikeService {
	constructor(private readonly likeRepository: LikeRepository) {}

	addLike(postId: string, userId: string) {
		return this.likeRepository.addLike(postId, userId);
	}

	deleteLike(postId: string, userId: string) {
		return this.likeRepository.deleteLike(postId, userId);
	}

	countLike(postId: string) {
		return this.likeRepository.countLike(postId);
	}
}

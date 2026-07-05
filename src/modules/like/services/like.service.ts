import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { AlreadyLikedException } from '../exceptions/already-liked.exception';

@Injectable()
export class LikeService {
	constructor(private readonly likeRepository: LikeRepository) {}

	async addLike(postId: string, userId: string) {
		const alreadyLiked = await this.isLiked(postId, userId);
		if (alreadyLiked) throw new AlreadyLikedException();
		return this.likeRepository.addLike(postId, userId);
	}

	deleteLike(postId: string, userId: string) {
		return this.likeRepository.deleteLike(postId, userId);
	}

	countLike(postId: string) {
		return this.likeRepository.countLike(postId);
	}

	isLiked(postId: string, userId: string) {
		return this.likeRepository
			.isLiked(postId, userId)
			.then((like) => !!like);
	}
}

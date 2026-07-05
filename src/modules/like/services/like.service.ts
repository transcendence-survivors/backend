import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { AlreadyLikedException } from '../exceptions/already-liked.exception';
import { LikeDoesNotExistException } from '../exceptions/like-does-not-exist.exception';

@Injectable()
export class LikeService {
	constructor(private readonly likeRepository: LikeRepository) {}

	async addLike(postId: string, userId: string) {
		const isLiked = await this.isLiked(postId, userId);
		if (isLiked) throw new AlreadyLikedException();
		await this.likeRepository.addLike(postId, userId);
	}

	async deleteLike(postId: string, userId: string) {
		const isLiked = await this.isLiked(postId, userId);
		if (!isLiked) throw new LikeDoesNotExistException();
		await this.likeRepository.deleteLike(postId, userId);
	}

	countLike(postId: string) {
		return this.likeRepository.countLike(postId);
	}

	async isLiked(postId: string, userId: string) {
		const like = await this.likeRepository.isLiked(postId, userId);
		return !!like;
	}
}

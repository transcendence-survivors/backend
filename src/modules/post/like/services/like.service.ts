import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { AlreadyLikedException } from '../exceptions/already-liked.exception';
import { LikeDoesNotExistException } from '../exceptions/like-does-not-exist.exception';
import { LikeMapper } from '../mappers/like.mapper';
import { LikeInfoResponseDto } from '../dtos/responses/like-info-response.dto';

@Injectable()
export class LikeService {
	constructor(
		private readonly likeRepository: LikeRepository,
		private readonly mapper: LikeMapper,
	) {}

	async addLike(postId: string, userId: string): Promise<void> {
		const isLiked = await this.isLiked(postId, userId);
		if (isLiked) throw new AlreadyLikedException();
		await this.likeRepository.addLike(postId, userId);
	}

	async deleteLike(postId: string, userId: string): Promise<void> {
		const isLiked = await this.isLiked(postId, userId);
		if (!isLiked) throw new LikeDoesNotExistException();
		await this.likeRepository.deleteLike(postId, userId);
	}

	countLike(postId: string): Promise<number> {
		return this.likeRepository.countLike(postId);
	}

	async isLiked(postId: string, userId: string): Promise<boolean> {
		const like = await this.likeRepository.isLiked(postId, userId);
		return !!like;
	}

	async getLikeInfo(
		postId: string,
		userId: string,
	): Promise<LikeInfoResponseDto> {
		const [count, isLiked] = await Promise.all([
			this.countLike(postId),
			this.isLiked(postId, userId),
		]);

		return this.mapper.toInfoDto(count, isLiked);
	}
}

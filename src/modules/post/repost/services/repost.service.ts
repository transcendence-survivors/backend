import { Injectable } from '@nestjs/common';
import { RepostRepository } from '../repositories/repost.repositories';
import { AlreadyRepostedException } from '../exceptions/already-reposted.exception';
import { RepostDoesNotExistException } from '../exceptions/repost-does-not-exist.exception';
import { RepostMapper } from '../mappers/repost.mapper';
import { RepostInfoResponseDto } from '../dtos/responses/repost-info-response.dto';

@Injectable()
export class RepostService {
	constructor(
		private readonly repostRepository: RepostRepository,
		private readonly mapper: RepostMapper,
	) {}

	async isReposted(postId: string, userId: string): Promise<boolean> {
		const repost = await this.repostRepository.isReposted(postId, userId);
		return !!repost;
	}

	async addRepost(postId: string, userId: string): Promise<void> {
		const isReposted = await this.isReposted(postId, userId);
		if (isReposted) throw new AlreadyRepostedException();
		await this.repostRepository.addRepost(postId, userId);
	}

	async deleteRepost(postId: string, userId: string): Promise<void> {
		const isReposted = await this.isReposted(postId, userId);
		if (!isReposted) throw new RepostDoesNotExistException();
		await this.repostRepository.deleteRepost(postId, userId);
	}

	countsReposts(postId: string): Promise<number> {
		return this.repostRepository.countRepost(postId);
	}

	async getRepostInfo(
		postId: string,
		userId: string,
	): Promise<RepostInfoResponseDto> {
		const [count, isReposted] = await Promise.all([
			this.countsReposts(postId),
			this.isReposted(postId, userId),
		]);

		return this.mapper.toInfoDto(count, isReposted);
	}
}

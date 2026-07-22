import { Injectable } from '@nestjs/common';
import { RepostRepository } from '../repositories/repost.repositories';
import { AlreadyRepostedException } from '../exceptions/already-reposted.exception';
import { RepostDoesNotExistException } from '../exceptions/repost-does-not-exist.exception';

@Injectable()
export class RepostService {
	constructor(private readonly repostRepository: RepostRepository) {}

	private async isReposted(postId: string, userId: string) {
		const repost = await this.repostRepository.isReposted(postId, userId);
		return !!repost;
	}

	async addRepost(postId: string, userId: string) {
		const isReposted = await this.isReposted(postId, userId);
		if (isReposted) throw new AlreadyRepostedException();
		await this.repostRepository.addRepost(postId, userId);
	}

	async deleteRepost(postId: string, userId: string) {
		const isReposted = await this.isReposted(postId, userId);
		if (!isReposted) throw new RepostDoesNotExistException();
		await this.repostRepository.deleteRepost(postId, userId);
	}

	async countsReposts(postId: string) {
		return this.repostRepository.countRepost(postId);
	}
}

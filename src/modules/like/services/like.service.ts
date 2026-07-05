import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { AlreadyLikedException } from '../exceptions/already-liked.exception';
import { Prisma } from '@prisma-generated/client';
import { LikeDoesNotExistException } from '../exceptions/like-does-not-exist.exception';

@Injectable()
export class LikeService {
	constructor(private readonly likeRepository: LikeRepository) {}

	async addLike(postId: string, userId: string) {
		try {
			return await this.likeRepository.addLike(postId, userId);
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err.code === 'P2002'
			) {
				throw new AlreadyLikedException();
			}
			throw err;
		}
	}

	async deleteLike(postId: string, userId: string) {
		try {
			return await this.likeRepository.deleteLike(postId, userId);
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err.code === 'P2025'
			) {
				throw new LikeDoesNotExistException();
			}
			throw err;
		}
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

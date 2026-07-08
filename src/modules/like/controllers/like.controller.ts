import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { LikeService } from '../services/like.service';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@UseGuards(JWTAccessGuard)
@Controller('likes')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@Post(':postId')
	@ResponseEnvelope('post liked successfully')
	addLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.likeService.addLike(postId, user.sub);
	}

	@Delete(':postId')
	@ResponseEnvelope('post unliked successfully')
	deleteLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.likeService.deleteLike(postId, user.sub);
	}

	@Get(':postId')
	@ResponseEnvelope('like info retrieved successfully')
	async getLikeInfo(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		const [count, isLiked] = await Promise.all([
			this.likeService.countLike(postId),
			this.likeService.isLiked(postId, user.sub),
		]);
		return { count, isLiked };
	}
}

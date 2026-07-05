import { BaseController } from '@/shared/base.controller';
import {
	Body,
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

@Controller('likes')
export class LikeController extends BaseController {
	constructor(private readonly likeService: LikeService) {
		super();
	}

	@UseGuards(JWTAccessGuard)
	@Post(':postId')
	addLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.likeService.addLike(postId, user.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Delete(':postId')
	deleteLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.likeService.deleteLike(postId, user.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get(':postId')
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

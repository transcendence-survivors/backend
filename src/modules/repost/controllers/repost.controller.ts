import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { RepostService } from '../services/repost.service';

@UseGuards(JWTAccessGuard)
@Controller('reposts')
export class RepostController {
	constructor(private readonly repostService: RepostService) {}

	@Post(':postId')
	@ResponseEnvelope('post reposted successfully')
	addRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.repostService.addRepost(postId, user.sub);
	}

	@Delete(':postId')
	@ResponseEnvelope('repost removed successfully')
	deleteRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.repostService.deleteRepost(postId, user.sub);
	}

	@Get(':postId')
	@ResponseEnvelope('repost info retrieved successfully')
	async getRepostInfo(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		const [count, isReposted] = await Promise.all([
			this.repostService.countsReposts(postId),
			this.repostService.isReposted(postId, user.sub),
		]);
		return { count, isReposted };
	}
}

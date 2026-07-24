import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { LikeService } from '../services/like.service';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { LikeInfoResponseDto } from '../dtos/responses/like-info-response.dto';

const ApiPostIdParam = () =>
	ApiParam({
		name: 'postId',
		description: 'The id of the target post',
		type: String,
		format: 'uuid',
	});

@UseGuards(JWTAccessGuard)
@Controller('likes')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@Post(':postId')
	@ApiPostIdParam()
	@ResponseEnvelope('post liked successfully')
	addLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		return this.likeService.addLike(postId, user.sub);
	}

	@Delete(':postId')
	@ApiPostIdParam()
	@ResponseEnvelope('post unliked successfully')
	deleteLike(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		return this.likeService.deleteLike(postId, user.sub);
	}

	@Get(':postId')
	@HttpCode(200)
	@ApiPostIdParam()
	@ApiSuccessResponse(LikeInfoResponseDto)
	@ResponseEnvelope('like info retrieved successfully')
	getLikeInfo(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<LikeInfoResponseDto> {
		return this.likeService.getLikeInfo(postId, user.sub);
	}
}

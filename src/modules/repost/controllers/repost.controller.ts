import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { RepostService } from '../services/repost.service';
import { RepostInfoResponseDto } from '../dtos/responses/repost-info-response.dto';

@UseGuards(JWTAccessGuard)
@Controller('reposts')
export class RepostController {
	constructor(private readonly repostService: RepostService) {}

	@Post(':postId')
	@HttpCode(HttpStatus.CREATED)
	@ApiParam({
		name: 'postId',
		description: 'The id of the post to repost',
		type: String,
		format: 'uuid',
	})
	@ResponseEnvelope('post reposted successfully')
	async addRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		await this.repostService.addRepost(postId, user.sub);
	}

	@Delete(':postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({
		name: 'postId',
		description: 'The id of the post to remove the repost from',
		type: String,
		format: 'uuid',
	})
	@ResponseEnvelope('repost removed successfully')
	async deleteRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		await this.repostService.deleteRepost(postId, user.sub);
	}

	@Get(':postId')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'postId',
		description: 'The id of the post to retrieve the repost info from',
		type: String,
		format: 'uuid',
	})
	@ApiSuccessResponse(RepostInfoResponseDto)
	@ResponseEnvelope('repost info retrieved successfully')
	getRepostInfo(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<RepostInfoResponseDto> {
		return this.repostService.getRepostInfo(postId, user.sub);
	}
}

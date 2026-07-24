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
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { RepostService } from '../services/repost.service';
import { RepostInfoResponseDto } from '../dtos/responses/repost-info-response.dto';

const ApiPostIdParam = () =>
	ApiParam({
		name: 'postId',
		description: 'The id of the target post',
		type: String,
		format: 'uuid',
	});

@UseGuards(JWTAccessGuard)
@Controller('reposts')
export class RepostController {
	constructor(private readonly repostService: RepostService) {}

	@Post(':postId')
	@ApiPostIdParam()
	@ResponseEnvelope('post reposted successfully')
	addRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		return this.repostService.addRepost(postId, user.sub);
	}

	@Delete(':postId')
	@ApiPostIdParam()
	@ResponseEnvelope('repost removed successfully')
	deleteRepost(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		return this.repostService.deleteRepost(postId, user.sub);
	}

	@Get(':postId')
	@HttpCode(200)
	@ApiPostIdParam()
	@ApiSuccessResponse(RepostInfoResponseDto)
	@ResponseEnvelope('repost info retrieved successfully')
	getRepostInfo(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<RepostInfoResponseDto> {
		return this.repostService.getRepostInfo(postId, user.sub);
	}
}

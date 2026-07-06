import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BlockAddDto } from '../dtos/requests/block-add.dto';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { BlockService } from '../services/block.service';
import { BlockPaginateDto } from '../dtos/requests/block-paginate.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { BlockPaginatedResponseDto } from '../dtos/responses/block-paginated-response.dto';
import { BlockCreatedResponseDto } from '../dtos/responses/block-created-response.dto';
import {
	ApiCreatedSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { BlockCountDto } from '../dtos/requests/block-count.dto';
import {
	ApiBlockNotFoundResponse,
	ApiSelfBlockResponse,
	ApiSelfUnblockResponse,
} from '../decorators/block-api-error.decorators';
import {
	ApiConflictResponse,
	ApiNoContentResponse,
	ApiParam,
} from '@nestjs/swagger';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';

@Controller('blocks')
@UseGuards(JWTAccessGuard)
export class BlockController {
	constructor(private readonly service: BlockService) {}

	@Get()
	@HttpCode(200)
	@ApiQueryDto(BlockPaginateDto)
	@ApiSuccessResponse(BlockPaginatedResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Successfully retrieved blocked users')
	getBlocked(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: BlockPaginateDto,
	): Promise<BlockPaginatedResponseDto> {
		return this.service.blockCursor(sub, query);
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(BlockCountDto)
	@ApiSuccessResponse(BlockCountDto)
	@ApiValidationErrorResponse({ search: ['search must be a string'] })
	@ResponseEnvelope('Successfully retrieved blocked users count')
	count(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: BlockCountDto,
	) {
		return this.service.blockedCount(sub, query);
	}

	@Post()
	@HttpCode(201)
	@ApiBodyDto(BlockAddDto)
	@ApiSelfBlockResponse()
	@ApiConflictResponse()
	@ApiValidationErrorResponse({
		blockedId: ['blockedId must be a valid uuid'],
	})
	@ApiCreatedSuccessResponse(BlockCreatedResponseDto)
	@ResponseEnvelope('User blocked successfully')
	add(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() { blockedId }: BlockAddDto,
	): Promise<BlockCreatedResponseDto> {
		return this.service.create(sub, blockedId);
	}

	@Delete(':blockedId')
	@HttpCode(204)
	@ApiParam({
		name: 'blockedId',
		description: 'The UUID of the user to unblock',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		format: 'uuid',
	})
	@ApiNoContentResponse({ description: 'User unblocked successfully' })
	@ApiSelfUnblockResponse()
	@ApiBlockNotFoundResponse()
	async delete(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('blockedId') blockedId: string,
	): Promise<void> {
		await this.service.remove(sub, blockedId);
	}
}

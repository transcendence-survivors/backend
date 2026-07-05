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
import { BlockAddDto } from '../dto/requests/block-add.dto';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { BlockService } from '../services/block.service';
import { BlockPaginateDto } from '../dto/requests/block-paginate.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { BlockPaginatedResponseDto } from '../dto/responses/block-paginated-response.dto';
import { BlockCreatedResponseDto } from '../dto/responses/block-created-response.dto';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { BlockCountDto } from '../dto/requests/block-count.dto';
import {
	ApiBlockNotFoundResponse,
	ApiSelfBlockResponse,
	ApiSelfUnblockResponse,
} from '../block.decorators';
import { ApiConflictResponse } from '@nestjs/swagger';

@Controller('blocks')
@UseGuards(JWTAccessGuard)
export class BlockController {
	constructor(private readonly service: BlockService) {}

	@Get()
	@HttpCode(200)
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
	@ApiSuccessResponse(BlockCountDto)
	@ApiValidationErrorResponse({
		search: ['search must be a string'],
	})
	@ResponseEnvelope('Successfully retrieved blocked users count')
	count(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: BlockCountDto,
	) {
		return this.service.blockedCount(sub, query);
	}

	@Post()
	@HttpCode(201)
	@ApiSelfBlockResponse()
	@ApiConflictResponse()
	@ApiValidationErrorResponse({
		blockedId: ['blockedId must be a valid uuid'],
	})
	@ApiSuccessResponse(BlockCreatedResponseDto)
	@ResponseEnvelope('User blocked successfully')
	add(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() { blockedId }: BlockAddDto,
	): Promise<BlockCreatedResponseDto> {
		return this.service.create(sub, blockedId);
	}

	@Delete(':blockedId')
	@HttpCode(204)
	@ApiSelfUnblockResponse()
	@ApiBlockNotFoundResponse()
	async delete(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('blockedId') blockedId: string,
	): Promise<void> {
		await this.service.remove(sub, blockedId);
	}
}

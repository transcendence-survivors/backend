import {
	Controller,
	Get,
	HttpCode,
	Param,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ChatMessageService } from '../services/chat-message.service';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { ChatMessagePaginateDto } from '../dtos/requests/chat-message-paginate.dto';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { ChatMessagePaginatedListResponseDto } from '../dtos/responses/chat-message-paginated-list-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { ChatMessageCountResponseDto } from '../dtos/responses/chat-room-count-response.dto';

@UseGuards(JWTAccessGuard)
@Controller('chat/:roomId/messages')
export class ChatMessageController {
	constructor(private readonly service: ChatMessageService) {}

	@SearchThrottle()
	@Get()
	@HttpCode(200)
	@ApiQueryDto(ChatMessagePaginateDto)
	@ApiSuccessResponse(ChatMessagePaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Chat messages listed successfully')
	list(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: ChatMessagePaginateDto,
		@Param('roomId') roomId: string,
	): Promise<ChatMessagePaginatedListResponseDto> {
		return this.service.listMessages(query, sub, roomId);
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(ChatMessagePaginateDto)
	@ApiSuccessResponse(ChatMessageCountResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Chat messages count retrieved successfully')
	count(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: ChatMessagePaginateDto,
		@Param('roomId') roomId: string,
	): Promise<ChatMessageCountResponseDto> {
		return this.service.countMessages(query, sub, roomId);
	}
}

import {
	Controller,
	Get,
	HttpCode,
	Param,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ChatMemberService } from '../services/chat-member.service';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { ChatMemberPaginateDto } from '../dtos/requests/chat-member-paginate.dto';
import { ChatMemberCountDto } from '../dtos/requests/chat-member-count.dto';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { ChatMemberPaginatedListResponseDto } from '../dtos/responses/chat-member-paginated-list-response.dto';
import { ChatMemberCountResponseDto } from '../dtos/responses/chat-member-count-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ChatRoomMembershipGuard } from '../guards/chat-room-membership.guard';

@UseGuards(JWTAccessGuard, ChatRoomMembershipGuard)
@Controller('chat/:roomId/members')
export class ChatMemberController {
	constructor(private readonly service: ChatMemberService) {}

	@SearchThrottle()
	@Get()
	@HttpCode(200)
	@ApiQueryDto(ChatMemberPaginateDto)
	@ApiSuccessResponse(ChatMemberPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Chat members listed successfully')
	list(
		@Query() query: ChatMemberPaginateDto,
		@Param('roomId') roomId: string,
	): Promise<ChatMemberPaginatedListResponseDto> {
		return this.service.listMembers(query, roomId);
	}

	@Get('count')
	@HttpCode(200)
	@ApiQueryDto(ChatMemberCountDto)
	@ApiSuccessResponse(ChatMemberCountResponseDto)
	@ResponseEnvelope('Chat members count retrieved successfully')
	count(
		@Query() query: ChatMemberCountDto,
		@Param('roomId') roomId: string,
	): Promise<ChatMemberCountResponseDto> {
		return this.service.countMembers(query, roomId);
	}
}

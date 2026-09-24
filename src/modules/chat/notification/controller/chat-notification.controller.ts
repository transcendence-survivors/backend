import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { ChatNotificationService } from '../services/chat-notification.service';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { ChatNotificationUnreadCountResponseDto } from '../dto/reponses/chat-notification-unread-count-response.dto';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';

@UseGuards(JWTAccessGuard)
@Controller('chat/notifications')
export class ChatNotificationController {
	constructor(
		private readonly notificationService: ChatNotificationService,
	) {}

	@Get('unread-count')
	@HttpCode(HttpStatus.OK)
	@ApiSuccessResponse(ChatNotificationUnreadCountResponseDto)
	@ResponseEnvelope('Chat unread count retrieved successfully')
	unreadCount(
		@CurrentUser() user: JwtAccessPayload,
	): Promise<ChatNotificationUnreadCountResponseDto> {
		return this.notificationService.retrieveUnreadCount(user.sub);
	}
}

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ChatMessageService } from '../services/chat-message.service';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { ApiSuccessResponse } from '@/shared/decorators/api-success-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { ChatMessageSharePostResponseDto } from '../dtos/responses/chat-message-share-post-response.dto';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ChatMessageSharePostDto } from '../dtos/requests/chat-message-share-post.dto';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';

@UseGuards(JWTAccessGuard)
@Controller('chat/messages/share')
export class ChatMessageShareController {
	constructor(private readonly service: ChatMessageService) {}

	@Post('post')
	@HttpCode(HttpStatus.CREATED)
	@ApiBodyDto(ChatMessageSharePostResponseDto)
	@ApiSuccessResponse(ChatMessageSharePostResponseDto)
	@ResponseEnvelope('Post shared successfully')
	async sharePost(
		@CurrentUser() user: JwtAccessPayload,
		@Body() dto: ChatMessageSharePostDto,
	): Promise<ChatMessageSharePostResponseDto> {
		return this.service.sharePost(user.sub, dto);
	}
}

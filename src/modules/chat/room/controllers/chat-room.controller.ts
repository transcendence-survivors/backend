import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from '../services/chat-room.service';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import {
	ApiCreatedSuccessResponse,
	ApiNoContentSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ChatRoomPaginateDto } from '../dtos/requests/chat-room-paginate.dto';
import { ChatRoomPaginatedListResponseDto } from '../dtos/responses/chat-room-paginated-list-response.dto';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ChatRoomListItemResponseDto } from '../dtos/responses/chat-room-list-item-response.dto';
import { ChatRoomCreateDto } from '../dtos/requests/chat-room-create.dto';

import { ChatRoomUpdateDto } from '../dtos/requests/chat-room-update.dto';
import { ApiGroupedErrorResponse } from '@/shared/decorators/api-error-response.decorator';
import {
	ChatRoomDirectImmutableException,
	ChatRoomUpdateEmptyException,
	SelfChatDmException,
} from '../exceptions/chat-room-bad.exception';
import { ChatRoomNotFoundException } from '../exceptions/chat-room-not-found.exceptions';
import { ChatUserNotFoundException } from '../exceptions/chat-user-not-found.exception';
import { ChatRoomDmConflictException } from '../exceptions/chat-room-conflict.exception';

@UseGuards(JWTAccessGuard)
@Controller('chat/rooms')
export class ChatRoomController {
	constructor(private readonly service: ChatRoomService) {}

	@SearchThrottle()
	@Get()
	@HttpCode(200)
	@ApiQueryDto(ChatRoomPaginateDto)
	@ApiSuccessResponse(ChatRoomPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Chat rooms listed successfully')
	list(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Query() query: ChatRoomPaginateDto,
	): Promise<ChatRoomPaginatedListResponseDto> {
		return this.service.listChatRooms(query, sub);
	}

	@Post()
	@HttpCode(201)
	@ApiCreatedSuccessResponse(ChatRoomListItemResponseDto)
	@ApiValidationErrorResponse({
		name: ['name must be a string'],
		type: ['type must be a valid enum value'],
		userIds: ['userIds must be an array of strings'],
	})
	@ApiGroupedErrorResponse([SelfChatDmException])
	@ApiGroupedErrorResponse([ChatUserNotFoundException])
	@ApiGroupedErrorResponse([ChatRoomDmConflictException])
	@ResponseEnvelope('Chat room created successfully')
	create(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() body: ChatRoomCreateDto,
	): Promise<ChatRoomListItemResponseDto> {
		return this.service.createRoom(body, sub);
	}

	@Patch(':roomId')
	@HttpCode(204)
	@ApiNoContentSuccessResponse()
	@ApiValidationErrorResponse({
		name: ['name must be a string'],
		avatarUrl: ['avatarUrl must be a valid URL'],
	})
	@ApiGroupedErrorResponse([
		ChatRoomDirectImmutableException,
		ChatRoomUpdateEmptyException,
	])
	@ApiGroupedErrorResponse([ChatRoomNotFoundException])
	@ResponseEnvelope('Chat room updated successfully')
	update(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('roomId') roomId: string,
		@Body() body: ChatRoomUpdateDto,
	): Promise<void> {
		return this.service.updateRoom(roomId, sub, body);
	}

	@Delete(':roomId')
	@HttpCode(204)
	@ApiNoContentSuccessResponse()
	@ApiGroupedErrorResponse([ChatRoomNotFoundException])
	@ResponseEnvelope('Chat room deleted successfully')
	delete(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('roomId') roomId: string,
	): Promise<void> {
		return this.service.deleteRoom(roomId, sub);
	}

	@Get(':roomId')
	@HttpCode(200)
	@ApiSuccessResponse(ChatRoomListItemResponseDto)
	@ApiGroupedErrorResponse([ChatRoomNotFoundException])
	@ResponseEnvelope('Chat room retrieved successfully')
	get(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('roomId') roomId: string,
	): Promise<ChatRoomListItemResponseDto> {
		return this.service.getRoom(roomId, sub);
	}
}

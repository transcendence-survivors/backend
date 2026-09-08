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
import { ChatMemberService } from '../services/chat-member.service';
import { SearchThrottle } from '@/core/rate-limit/decorators/throttle-presets.decorator';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { ChatMemberPaginateDto } from '../dtos/requests/chat-member-paginate.dto';
import { ChatMemberCountDto } from '../dtos/requests/chat-member-count.dto';
import {
	ApiNoContentSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ChatMemberPaginatedListResponseDto } from '../dtos/responses/chat-member-paginated-list-response.dto';
import { ChatMemberCountResponseDto } from '../dtos/responses/chat-member-count-response.dto';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ChatRoomMembershipGuard } from '../guards/chat-room-membership.guard';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ChatMemberListItemResponseDto } from '../dtos/responses/chat-member-list-item-response.dto';
import {
	ChatMemberSelfOwnershipException,
	MemberAlreadyHasRoleException,
	SelfKickException,
	SelfRoleModificationException,
} from '../exceptions/chat-member-bad.exception';
import { MemberNotFoundInRoomException } from '../exceptions/chat-member-not-found.exception';
import {
	ChatMemberNotOwnerException,
	InsufficientMemberPermissionException,
} from '../exceptions/chat-member-forbidden.exception';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { type JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ChatMemberUpdateRoleDto } from '../dtos/requests/chat-member-update-role.dto';
import { ApiGroupedErrorResponse } from '@/shared/decorators/api-error-response.decorator';
import { ChatRoomNotFoundException } from '../../room/exceptions/chat-room-not-found.exceptions';
import { ChatOwnershipTransferDto } from '../dtos/requests/chat-ownership-transfer.dto';

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

	@Post('transfer-ownership')
	@HttpCode(204)
	@ApiNoContentSuccessResponse()
	@ApiValidationErrorResponse({
		targetUserId: ['targetUserId must be a valid UUID'],
	})
	@ApiGroupedErrorResponse([
		ChatMemberSelfOwnershipException,
		ChatMemberNotOwnerException,
	])
	@ApiGroupedErrorResponse([
		MemberNotFoundInRoomException,
		ChatRoomNotFoundException,
	])
	@ResponseEnvelope('Room ownership transferred successfully')
	transferOwnership(
		@CurrentUser() { sub }: JwtAccessPayload,
		@Param('roomId') roomId: string,
		@Body() { targetUserId }: ChatOwnershipTransferDto,
	): Promise<void> {
		return this.service.transferOwnership(roomId, sub, targetUserId);
	}

	@Patch(':targetUserId/role')
	@HttpCode(200)
	@ApiBodyDto(ChatMemberUpdateRoleDto)
	@ApiSuccessResponse(ChatMemberListItemResponseDto)
	@ApiValidationErrorResponse({
		role: ['Role must be a valid ChatMemberRole (ADMIN or MEMBER)'],
	})
	@ApiGroupedErrorResponse([
		SelfRoleModificationException,
		MemberAlreadyHasRoleException,
	])
	@ApiGroupedErrorResponse([InsufficientMemberPermissionException])
	@ApiGroupedErrorResponse([MemberNotFoundInRoomException])
	@ResponseEnvelope('Member role updated successfully')
	updateRole(
		@Param('roomId') roomId: string,
		@Param('targetUserId') targetUserId: string,
		@CurrentUser() { sub }: JwtAccessPayload,
		@Body() dto: ChatMemberUpdateRoleDto,
	): Promise<ChatMemberListItemResponseDto> {
		return this.service.updateMemberRole(
			roomId,
			sub,
			targetUserId,
			dto.role,
		);
	}

	@Delete(':targetUserId')
	@HttpCode(204)
	@ApiGroupedErrorResponse([SelfKickException])
	@ApiGroupedErrorResponse([InsufficientMemberPermissionException])
	@ApiGroupedErrorResponse([MemberNotFoundInRoomException])
	@ResponseEnvelope('Member kicked successfully')
	async kickMember(
		@Param('roomId') roomId: string,
		@Param('targetUserId') targetUserId: string,
		@CurrentUser() { sub }: JwtAccessPayload,
	): Promise<void> {
		await this.service.kickMember(roomId, sub, targetUserId);
	}
}

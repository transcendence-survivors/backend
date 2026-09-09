import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatMemberRepository } from '../repositories/chat-member.repository';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';
import { ChatMemberPaginateDto } from '../dtos/requests/chat-member-paginate.dto';
import { ChatMemberPaginatedListResponseDto } from '../dtos/responses/chat-member-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { ChatMemberMapper } from '../mappers/chat-member.mapper';
import { ChatMemberCountDto } from '../dtos/requests/chat-member-count.dto';
import { ChatMemberCountResponseDto } from '../dtos/responses/chat-member-count-response.dto';
import { ChatMemberPermissionService } from './chat-member-permission.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMemberRole } from '@prisma-generated/enums';
import { ChatMemberListItemResponseDto } from '../dtos/responses/chat-member-list-item-response.dto';
import {
	ChatMemberSelfOwnershipException,
	MemberAlreadyHasRoleException,
	SelfKickException,
	SelfRoleModificationException,
} from '../exceptions/chat-member-bad.exception';
import { ChatMemberNotFoundException } from '../exceptions/chat-member-not-found.exception';
import {
	ChatMemberNotOwnerException,
	InsufficientMemberPermissionException,
} from '../exceptions/chat-member-forbidden.exception';
import { ChatMemberPermissionEnum } from '../types/enums/chat-member-permission.enum';
import { ChatMemberRoleUpdatedEvent } from '@/contracts/events/internal/chat/chat-member-role-updated.event';
import {
	APP_EVENTS,
	ChatOwnershipTransferredEvent,
} from '@/contracts/events/internal';
import { ChatMemberKickedEvent } from '@/contracts/events/internal/chat/chat-member-kicked.event';
import { UnitOfWork } from '@/core/database/uow/unit-of-work';

@Injectable()
export class ChatMemberService {
	constructor(
		private readonly repo: ChatMemberRepository,
		private readonly mapper: ChatMemberMapper,
		private readonly cursor: CursorService,
		private readonly permissionService: ChatMemberPermissionService,
		private readonly eventEmitter: EventEmitter2,
		private readonly uow: UnitOfWork,
	) {}

	async listMembers(
		{ limit, cursor, search, orderBy }: ChatMemberPaginateDto,
		roomId: string,
	): Promise<ChatMemberPaginatedListResponseDto> {
		const members = await this.repo.cursor({
			limit,
			cursor,
			search,
			orderBy,
			roomId,
		});

		const dtos = this.mapper.toListItemDtoList(members);
		const pagination = this.cursor.create(dtos, limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(pagination);
	}

	async countMembers(
		{ search }: ChatMemberCountDto,
		roomId: string,
	): Promise<ChatMemberCountResponseDto> {
		const membersCount = await this.repo.count({
			search,
			roomId,
		});

		return this.mapper.toCountDto(membersCount);
	}

	findByRoomAndUser(params: ChatMemberFindParams) {
		return this.repo.findByRoomAndUser(params);
	}

	async checkMembership(params: ChatMemberFindParams): Promise<void> {
		const member = await this.repo.findByRoomAndUser(params);
		if (!member) {
			throw new ForbiddenException(
				'You are not a member of this chat room',
			);
		}
	}

	async updateMemberRole(
		roomId: string,
		actorId: string,
		targetUserId: string,
		newRole: ChatMemberRole,
	): Promise<ChatMemberListItemResponseDto> {
		if (actorId === targetUserId) throw new SelfRoleModificationException();
		const [actor, target] = await Promise.all([
			this.repo.findByRoomAndUser({ roomId, userId: actorId }),
			this.repo.findByRoomAndUser({ roomId, userId: targetUserId }),
		]);

		if (!target || !actor) throw new ChatMemberNotFoundException();
		if (target.role === newRole) throw new MemberAlreadyHasRoleException();

		const isPromotion =
			this.permissionService.getRoleRank(newRole) >
			this.permissionService.getRoleRank(target.role);
		const requiredPermission = isPromotion
			? ChatMemberPermissionEnum.MEMBER_PROMOTE
			: ChatMemberPermissionEnum.MEMBER_DEMOTE;
		const isAllowed = this.permissionService.canManageMember({
			actorRole: actor.role,
			targetRole: target.role,
			permission: requiredPermission,
			desiredRole: newRole,
		});

		if (!isAllowed) {
			throw new InsufficientMemberPermissionException();
		}

		const oldRole = target.role;
		const updatedMember = await this.repo.updateRole({
			role: newRole,
			roomId,
			userId: targetUserId,
		});

		this.eventEmitter.emit(
			APP_EVENTS.CHAT_MEMBER_ROLE_UPDATED,
			new ChatMemberRoleUpdatedEvent(
				roomId,
				actorId,
				targetUserId,
				newRole,
				oldRole,
			),
		);

		return this.mapper.toListItemDto(updatedMember);
	}

	async kickMember(
		roomId: string,
		actorId: string,
		targetUserId: string,
	): Promise<void> {
		if (actorId === targetUserId) throw new SelfKickException();

		const [actor, target] = await Promise.all([
			this.repo.findByRoomAndUser({ roomId, userId: actorId }),
			this.repo.findByRoomAndUser({ roomId, userId: targetUserId }),
		]);

		if (!target || !actor) throw new ChatMemberNotFoundException();
		const isAllowed = this.permissionService.canManageMember({
			actorRole: actor.role,
			targetRole: target.role,
			permission: ChatMemberPermissionEnum.MEMBER_KICK,
		});

		if (!isAllowed) throw new InsufficientMemberPermissionException();
		await this.repo.deleteMember({
			roomId,
			userId: targetUserId,
		});
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_MEMBER_KICKED,
			new ChatMemberKickedEvent(roomId, actorId, targetUserId),
		);
	}

	async transferOwnership(
		roomId: string,
		actorId: string,
		targetUserId: string,
	): Promise<void> {
		if (actorId === targetUserId)
			throw new ChatMemberSelfOwnershipException();
		const [actor, target] = await Promise.all([
			this.repo.findByRoomAndUser({ roomId, userId: actorId }),
			this.repo.findByRoomAndUser({ roomId, userId: targetUserId }),
		]);

		if (!target || !actor) throw new ChatMemberNotFoundException();
		if (actor.role !== ChatMemberRole.OWNER)
			throw new ChatMemberNotOwnerException();

		const oldRole = target.role;
		const newRole = ChatMemberRole.OWNER;
		await this.uow.run(async (ctx) => {
			await this.repo.updateRole(
				{
					roomId,
					userId: actorId,
					role: ChatMemberRole.ADMIN,
				},
				ctx,
			);
			await this.repo.updateRole(
				{
					roomId,
					userId: targetUserId,
					role: ChatMemberRole.OWNER,
				},
				ctx,
			);
		});
		this.eventEmitter.emit(
			APP_EVENTS.CHAT_OWNERSHIP_TRANSFERRED,
			new ChatOwnershipTransferredEvent(
				roomId,
				actorId,
				targetUserId,
				oldRole,
				newRole,
			),
		);
	}
}

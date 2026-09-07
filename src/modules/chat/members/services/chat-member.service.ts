import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatMemberRepository } from '../repositories/chat-member.repository';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';
import { ChatMemberPaginateDto } from '../dtos/requests/chat-member-paginate.dto';
import { ChatMemberPaginatedListResponseDto } from '../dtos/responses/chat-member-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { ChatMemberMapper } from '../mappers/chat-member.mapper';
import { ChatMemberCountDto } from '../dtos/requests/chat-member-count.dto';
import { ChatMemberCountResponseDto } from '../dtos/responses/chat-member-count-response.dto';

@Injectable()
export class ChatMemberService {
	constructor(
		private readonly repo: ChatMemberRepository,
		private readonly mapper: ChatMemberMapper,
		private readonly cursor: CursorService,
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
}

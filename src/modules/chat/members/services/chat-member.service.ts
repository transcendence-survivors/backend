import { Injectable } from '@nestjs/common';
import { ChatMemberRepository } from '../repositories/chat-member.repository';
import { ChatMemberMapper } from '../mappers/chat-member.mapper';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';

@Injectable()
export class ChatMemberService {
	constructor(
		private readonly repo: ChatMemberRepository,
		private readonly mapper: ChatMemberMapper,
	) {}

	findByRoomAndUser(params: ChatMemberFindParams) {
		return this.repo.findByRoomAndUser(params);
	}
}

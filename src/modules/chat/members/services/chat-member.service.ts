import { Injectable } from '@nestjs/common';
import { ChatMemberRepository } from '../repositories/chat-member.repository';
import { ChatMemberMapper } from '../mappers/chat-member.mapper';

@Injectable()
export class ChatMemberService {
	constructor(
		private readonly repo: ChatMemberRepository,
		private readonly mapper: ChatMemberMapper,
	) {}
}

import { Injectable } from '@nestjs/common';
import { ChatMemberRepository } from '../repositories/chat-member.repository';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';

@Injectable()
export class ChatMemberService {
	constructor(private readonly repo: ChatMemberRepository) {}

	findByRoomAndUser(params: ChatMemberFindParams) {
		return this.repo.findByRoomAndUser(params);
	}

	async checkMembership(params: ChatMemberFindParams) {
		const member = await this.repo.findByRoomAndUser(params);
		if (!member) {
			throw new Error('User is not a member of this room');
		}
	}
}

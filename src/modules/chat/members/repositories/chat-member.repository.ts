import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatMemberFindParams } from '../types/params/chat-member-find.params';

@Injectable()
export class ChatMemberRepository {
	constructor(private readonly prisma: PrismaService) {}

	findByRoomAndUser({ roomId, userId }: ChatMemberFindParams) {
		return this.prisma.chatMember.findUnique({
			where: { roomId_userId: { roomId, userId } },
		});
	}
}

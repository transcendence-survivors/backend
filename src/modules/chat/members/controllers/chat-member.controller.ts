import { Controller, UseGuards } from '@nestjs/common';
import { ChatMemberService } from '../services/chat-member.service';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';

@UseGuards(JWTAccessGuard)
@Controller('chat-room/:roomId/member')
export class ChatMemberController {
	constructor(private readonly service: ChatMemberService) {}
}

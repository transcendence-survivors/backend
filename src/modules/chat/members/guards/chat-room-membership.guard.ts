import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ChatMemberService } from '../services/chat-member.service';
import { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { Request } from 'express';

interface RoomRequest extends Request<{ roomId?: string }> {
	user?: JwtAccessPayload;
}

@Injectable()
export class ChatRoomMembershipGuard implements CanActivate {
	constructor(private readonly memberService: ChatMemberService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RoomRequest>();
		const userId = request.user?.sub;
		const roomId = request.params?.roomId;

		if (!userId || !roomId) {
			throw new ForbiddenException('Missing user or room context');
		}
		await this.memberService.checkMembership({ roomId, userId });
		return true;
	}
}

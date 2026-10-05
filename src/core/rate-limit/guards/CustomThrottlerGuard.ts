import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Socket } from 'socket.io';

import { ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected async getTracker(req: Record<string, any>): Promise<string> {
		if (req.client instanceof Socket) {
			const client = req.client as ClientSocket;

			const userId = client.data?.user?.sub;
			if (userId) return `ws:user:${String(userId)}`;

			const ip = client.handshake?.address;
			if (ip) return `ws:ip:${ip}`;

			return `ws:socket:${client.id}`;
		}

		const userId = req.user?.sub ?? req.user?.id;
		if (userId) {
			return `http:user:${String(userId)}`;
		}

		const forwardedFor = req.headers?.['x-forwarded-for'];
		if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
			const clientIp = forwardedFor.split(',')[0].trim();

			if (clientIp) return `http:ip:${clientIp}`;
		}

		const realIp = req.headers?.['x-real-ip'];
		if (typeof realIp === 'string' && realIp.length > 0) {
			return `http:ip:${realIp}`;
		}

		return `http:ip:${req.ip ?? 'unknown'}`;
	}

	protected getRequestResponse(context: ExecutionContext) {
		if (context.getType() === 'ws') {
			const client = context.switchToWs().getClient<Socket>();

			return {
				req: { client },
				res: {},
			};
		}

		return super.getRequestResponse(context);
	}
}

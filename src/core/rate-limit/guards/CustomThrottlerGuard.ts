import { ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Socket } from 'socket.io';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected getTracker(req: Record<string, any>): Promise<string> {
		if (req.client && req.client instanceof Socket) {
			const client = req.client as ClientSocket;

			const userId = client.data?.user?.sub;
			if (userId) {
				return Promise.resolve(`ws:user:${userId}`);
			}

			const ip = client.handshake?.address;
			if (ip) {
				return Promise.resolve(`ws:ip:${ip}`);
			}

			return Promise.resolve(`ws:socket:${client.id}`);
		}

		return Promise.resolve(req.ip);
	}

	protected getRequestResponse(context: ExecutionContext) {
		if (context.getType() === 'ws') {
			const wsContext = context.switchToWs();
			const client = wsContext.getClient<Socket>();

			return {
				req: { client },
				res: {},
			};
		}

		return super.getRequestResponse(context);
	}
}

import { ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Socket } from 'socket.io';

interface AuthenticatedRequest {
	user?: {
		sub?: string;
		id?: string;
	};
	body?: {
		email?: string;
		username?: string;
	};
	ip?: string;
	client?: unknown;
}

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected getTracker(req: Record<string, unknown>): Promise<string> {
		const httpReq = req as AuthenticatedRequest;

		if (httpReq.client && httpReq.client instanceof Socket) {
			const client = httpReq.client as ClientSocket;

			const userId = client.data?.user?.sub;
			if (userId) {
				return Promise.resolve(`ws:user:${userId}`);
			}

			const forwardedFor = client.handshake?.headers['x-forwarded-for'];
			let realIp: string | undefined;

			if (typeof forwardedFor === 'string') {
				realIp = forwardedFor.split(',')[0].trim();
			} else if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
				realIp = forwardedFor[0].trim();
			}

			const ip = realIp || client.handshake?.address;
			if (ip) {
				return Promise.resolve(`ws:ip:${ip}`);
			}

			return Promise.resolve(`ws:socket:${client.id}`);
		}

		const userId = httpReq.user?.sub || httpReq.user?.id;
		if (typeof userId === 'string' || typeof userId === 'number') {
			return Promise.resolve(`http:user:${userId}`);
		}

		const targetedIdentifier =
			httpReq.body?.email || httpReq.body?.username;
		if (typeof targetedIdentifier === 'string' && httpReq.ip) {
			return Promise.resolve(
				`http:login:${targetedIdentifier.toLowerCase()}:${httpReq.ip}`,
			);
		}

		return Promise.resolve(`http:ip:${httpReq.ip ?? 'unknown'}`);
	}

	protected getRequestResponse(context: ExecutionContext) {
		if (context.getType() === 'ws') {
			const wsContext = context.switchToWs();
			const client = wsContext.getClient<Socket>();

			return {
				req: { client },
				res: { header: () => undefined },
			};
		}

		return super.getRequestResponse(context);
	}
}

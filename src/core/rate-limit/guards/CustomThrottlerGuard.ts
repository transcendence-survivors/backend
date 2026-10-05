import { ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { ExecutionContext, Injectable } from '@nestjs/common';
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
	headers?: Record<string, string | string[] | undefined>;
	ip?: string;
	client?: unknown;
}

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected getTracker(req: Record<string, unknown>): Promise<string> {
		const httpReq = req as AuthenticatedRequest;

		if (httpReq.client instanceof Socket) {
			const client = httpReq.client as ClientSocket;

			const userId = client.data?.user?.sub;
			if (userId) return Promise.resolve(`ws:user:${String(userId)}`);

			const forwardedFor = client.handshake?.headers['x-forwarded-for'];
			let realIp: string | undefined;

			if (typeof forwardedFor === 'string') {
				realIp = forwardedFor.split(',')[0].trim();
			} else if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
				realIp = forwardedFor[0].trim();
			}

			const ip = realIp || client.handshake?.address;
			if (ip) return Promise.resolve(`ws:ip:${ip}`);

			return Promise.resolve(`ws:socket:${client.id}`);
		}

		const userId = httpReq.user?.sub ?? httpReq.user?.id;
		if (userId) {
			return Promise.resolve(`http:user:${String(userId)}`);
		}

		const targetedIdentifier =
			httpReq.body?.email || httpReq.body?.username;
		if (typeof targetedIdentifier === 'string' && httpReq.ip) {
			return Promise.resolve(
				`http:login:${targetedIdentifier.toLowerCase()}:${httpReq.ip}`,
			);
		}

		const forwardedFor = httpReq.headers?.['x-forwarded-for'];
		if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
			const clientIp = forwardedFor.split(',')[0].trim();
			if (clientIp) return Promise.resolve(`http:ip:${clientIp}`);
		}

		const realIp = httpReq.headers?.['x-real-ip'];
		if (typeof realIp === 'string' && realIp.length > 0) {
			return Promise.resolve(`http:ip:${realIp}`);
		}

		return Promise.resolve(`http:ip:${httpReq.ip ?? 'unknown'}`);
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

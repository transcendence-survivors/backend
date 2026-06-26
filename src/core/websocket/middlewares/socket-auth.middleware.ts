import { type ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { WsJWTAccessStrategy } from '@/core/security/strategies/jwt-access.strategy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketAuthMiddleware {
	constructor(private readonly wsJwtStrategy: WsJWTAccessStrategy) {}

	use(client: ClientSocket, next: (err?: Error) => void) {
		try {
			const userPayload = this.wsJwtStrategy.validateSocket(client);
			client.data.user = userPayload;
		} catch {
			client.data.user = null;
		}
		next();
	}
}

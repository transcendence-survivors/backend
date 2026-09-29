import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
	JWT_ACCESS_TOKEN_KEY,
	WsJWTAccessStrategy,
} from '../strategies/jwt-access.strategy';
import { type ClientSocket } from '../../websocket/interface/ws-socket.inteface';

export class JWTAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {}

@Injectable()
export class WsJWTAccessGuard implements CanActivate {
	constructor(private readonly wsJwtStrategy: WsJWTAccessStrategy) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient<ClientSocket>();
		try {
			const payload = await this.wsJwtStrategy.validateSocket(client);
			client.data.user = payload;
			return true;
		} catch {
			client.data.user = null;
			return false;
		}
	}
}

import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
	JWT_ACCESS_TOKEN_KEY,
	WsJWTAccessStrategy,
} from '../strategies/jwt-access.strategy';
import { type TypedSocket } from '../interfaces/ws-socket.inteface';

export class JWTAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {}

@Injectable()
export class WsJWTAccessGuard implements CanActivate {
	constructor(private wsStrategy: WsJWTAccessStrategy) {}

	canActivate(context: ExecutionContext): boolean {
		const client = context.switchToWs().getClient<TypedSocket>();
		client.data = client.data || {};

		try {
			const userContext = this.wsStrategy.validateSocket(client);
			client.data.user = userContext;
			return true;
		} catch {
			return false;
		}
	}
}

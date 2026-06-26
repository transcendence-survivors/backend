import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JWT_ACCESS_TOKEN_KEY } from '../strategies/jwt-access.strategy';
import { type ClientSocket } from '../../websocket/interface/ws-socket.inteface';

export class JWTAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {}

@Injectable()
export class WsJWTAccessGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const client = context.switchToWs().getClient<ClientSocket>();
		return !!client.data.user;
	}
}

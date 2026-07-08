import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_KEY } from '../strategies/jwt-access.strategy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTOptionalAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {
	handleRequest<TUser = any>(_err: unknown, user: unknown): TUser {
		return (user ?? null) as TUser;
	}
}

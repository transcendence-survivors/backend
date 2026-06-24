import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_KEY } from '../strategies/jwt-access.strategy';

export class JWTAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {}

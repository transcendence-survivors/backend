import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN_KEY } from '../strategies/jwt-refresh.strategy';

export class JWTRefreshGuard extends AuthGuard(JWT_REFRESH_TOKEN_KEY) {}

import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN_KEY } from '../strategies/refresh-token.strategy';

export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH_TOKEN_KEY) {}

import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_KEY } from '../strategies/access-token.strategy';

export class AccessTokenGuard extends AuthGuard(JWT_ACCESS_TOKEN_KEY) {}

import { AuthGuard } from '@nestjs/passport';
import { GAME_SERVER_KEY } from '../strategies/jwt-game-access.strategy';

export class JWTGameGuard extends AuthGuard(GAME_SERVER_KEY) {}

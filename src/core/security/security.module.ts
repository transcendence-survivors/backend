import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import {
	JWTAccessStrategy,
	WsJWTAccessStrategy,
} from './strategies/jwt-access.strategy';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtService } from '@nestjs/jwt';
import { JWTGameStrategy } from './strategies/jwt-game-access.strategy';

@Module({
	imports: [],
	providers: [
		RoleService,
		JWTAccessStrategy,
		JWTRefreshStrategy,
		WsJWTAccessStrategy,
		JwtService,
		JWTGameStrategy,
	],
	exports: [WsJWTAccessStrategy],
})
export class SecurityModule {}

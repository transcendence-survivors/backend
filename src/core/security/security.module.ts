import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import {
	JWTAccessStrategy,
	WsJWTAccessStrategy,
} from './strategies/jwt-access.strategy';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [],
	providers: [
		RoleService,
		JWTAccessStrategy,
		JWTRefreshStrategy,
		WsJWTAccessStrategy,
		JwtService,
	],
	exports: [WsJWTAccessStrategy],
})
export class SecurityModule {}

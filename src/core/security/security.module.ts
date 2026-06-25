import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { JWTAccessStrategy } from './strategies/jwt-access.strategy';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
	providers: [RoleService, JWTAccessStrategy, JWTRefreshStrategy],
})
export class SecurityModule {}

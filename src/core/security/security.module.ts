import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';

@Module({
	providers: [RoleService],
})
export class SecurityModule {}

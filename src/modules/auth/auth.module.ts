import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaService } from '@/common/prisma.service';
import { ProviderRepository } from './repositories/provider.repository';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { RoleService } from '../token/service/roles.service';

@Module({
	imports: [UserModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, PrismaService, ProviderRepository, RoleService],
})
export class AuthModule {}

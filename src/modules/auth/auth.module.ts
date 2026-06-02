import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PrismaService } from '@/common/prisma.service';
import { ProviderRepository } from './repository/provider.repository';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';

@Module({
	imports: [UserModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, PrismaService, ProviderRepository],
})
export class AuthModule {}

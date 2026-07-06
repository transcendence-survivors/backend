import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { TokenModule } from './token/token.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { AuthMapper } from './mappers/auth.mapper';

@Module({
	imports: [UserModule, TokenModule, AuthProviderModule],
	controllers: [AuthController],
	providers: [AuthService, AuthMapper],
})
export class AuthModule {}

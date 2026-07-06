import { Module } from '@nestjs/common';
import { LocalAuthProviderService } from './services/local-auth.services';
import { AuthProviderRepository } from './repositories/auth-provider.repository';

@Module({
	providers: [LocalAuthProviderService, AuthProviderRepository],
	exports: [LocalAuthProviderService],
})
export class AuthProviderModule {}

import { Module } from '@nestjs/common';
import { LocalAuthProviderService } from './services/local-auth.services';
import { AuthProviderRepository } from './repositories/provider.repository';

@Module({
	providers: [LocalAuthProviderService, AuthProviderRepository],
	exports: [LocalAuthProviderService],
})
export class AuthProviderModule {}

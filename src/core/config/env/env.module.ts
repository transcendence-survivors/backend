import { Global, Module } from '@nestjs/common';
import { EnvProvider } from './providers/env.provider';

@Global()
@Module({
	providers: [EnvProvider],
	exports: [EnvProvider],
})
export class EnvModule {}

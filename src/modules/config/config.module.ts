import { Global, Module } from '@nestjs/common';
import { EnvProvider } from './env/env.provider';

@Global()
@Module({
	providers: [EnvProvider],
	exports: [EnvProvider],
})
export class EnvModule {}

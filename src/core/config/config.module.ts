import { Global, Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';

@Global()
@Module({
	imports: [EnvModule],
})
export class ConfigModule {}

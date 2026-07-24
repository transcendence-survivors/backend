import { Global, Module } from '@nestjs/common';
import { HttpExceptionsFilter } from './filters/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { CursorService } from './services/cursor.service';
import { HealthController } from './health.controller';

@Global()
@Module({
	controllers: [HealthController],
	providers: [
		{
			provide: APP_PIPE,
			useClass: CustomValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionsFilter,
		},
		CursorService,
	],
	exports: [CursorService],
})
export class SharedModule {}

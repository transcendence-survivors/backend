import { Global, Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { ExceptionsFilter } from './filters/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

@Global()
@Module({
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
			useClass: ExceptionsFilter,
		},
		PaginationService,
	],
	exports: [PaginationService],
})
export class SharedModule {}

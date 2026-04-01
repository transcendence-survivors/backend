import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ExceptionsFilter } from './common/filters/http-exception.filter';
import { CustomValidationPipe } from './common/custom-validation.pipe';

void (async () => {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new CustomValidationPipe());
	app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalFilters(new ExceptionsFilter());

	await app.listen(process.env.PORT!);
})();

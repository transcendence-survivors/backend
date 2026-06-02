import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ExceptionsFilter } from './common/filters/http-exception.filter';
import { CustomValidationPipe } from './common/custom-validation.pipe';
import cookieParser from 'cookie-parser';

void (async () => {
	const appV1 = await NestFactory.create(AppModule);
	appV1.setGlobalPrefix('api/v1');
	appV1.use(cookieParser());
	appV1.useGlobalPipes(new CustomValidationPipe());
	appV1.useGlobalInterceptors(new ResponseInterceptor());
	appV1.useGlobalFilters(new ExceptionsFilter());
	await appV1.listen(process.env.NEST_PORT!);
})();

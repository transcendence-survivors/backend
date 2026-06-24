import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';

void (async () => {
	const appV1 = await NestFactory.create(AppModule);

	if (process.env.NODE_ENV === 'development') {
		appV1.enableCors({
			origin: true,
			credentials: true,
		});
	} else {
		appV1.enableCors({
			origin: process.env.FRONTEND_URL,
			credentials: true,
		});
	}
	appV1.setGlobalPrefix('api/v1');
	appV1.use(cookieParser());
	await appV1.listen(process.env.NEST_PORT!);
})();

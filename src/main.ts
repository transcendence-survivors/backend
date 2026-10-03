import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './core/websocket/adapters/socket-io.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomValidationPipe } from './shared/pipes/custom-validation.pipe';
import { ThrottlerFilter } from './shared/filters/throttler.filter.ts';
import { HttpExceptionsFilter } from './shared/filters/http-exception.filter';
import helmet from 'helmet';

const getSwaggerConfig = () => {
	return new DocumentBuilder()
		.setTitle('Light Keepers API')
		.setDescription('API documentation')
		.setVersion('1.0')
		.build();
};

void (async () => {
	const appV1 = await NestFactory.create(AppModule);

	appV1.use(
		helmet({
			contentSecurityPolicy: process.env.NODE_ENV === 'production',
			crossOriginEmbedderPolicy: false,
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		}),
	);

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
	appV1.use(cookieParser());
	appV1.useWebSocketAdapter(new SocketIoAdapter(appV1));
	appV1.setGlobalPrefix('api/v1');
	appV1.useGlobalFilters(new HttpExceptionsFilter(), new ThrottlerFilter());
	appV1.useGlobalPipes(new CustomValidationPipe());

	const document = SwaggerModule.createDocument(appV1, getSwaggerConfig(), {
		deepScanRoutes: true,
	});
	SwaggerModule.setup('docs', appV1, document);
	await appV1.listen(process.env.NEST_PORT!, '0.0.0.0');
})();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './core/websocket/adapters/socket-io.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
	appV1.useWebSocketAdapter(new SocketIoAdapter(appV1));
	appV1.setGlobalPrefix('api/v1');
	appV1.use(cookieParser());

	const document = SwaggerModule.createDocument(
		appV1,
		new DocumentBuilder()
			.setTitle('My API')
			.setDescription('API documentation')
			.setVersion('1.0')
			.build(),
		{
			deepScanRoutes: true,
		},
	);
	SwaggerModule.setup('docs', appV1, document);
	await appV1.listen(process.env.NEST_PORT!, '0.0.0.0');
})();

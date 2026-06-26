import { Module } from '@nestjs/common';
import { SocketAuthMiddleware } from './middlewares/socket-auth.middleware';

@Module({
	providers: [SocketAuthMiddleware],
	exports: [SocketAuthMiddleware],
})
export class WebsocketModule {}

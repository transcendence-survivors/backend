import { Module } from '@nestjs/common';
import { SocketAuthMiddleware } from './middlewares/socket-auth.middleware';
import { WsServerProvider } from './provider/ws-server.provider';

@Module({
	providers: [SocketAuthMiddleware, WsServerProvider],
	exports: [SocketAuthMiddleware, WsServerProvider],
})
export class WebsocketModule {}
